import http from 'http';
import * as pg from 'pg';
import * as dotenv from 'dotenv';


dotenv.config({ path: '../react/.env' });
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  REACT_APP_SERVER_PORT: SERVER_PORT,
  REACT_APP_PAGE_SIZE: PAGE_SIZE,
} = process.env;

const { default: { Pool } } = pg;
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
})

const condition = {
  eq: '=',
  gt: '>',
  lt: '<',
  like: 'LIKE',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = new URL(`${req.protocol}://${req.host}${req.url}`);

  if (url.pathname !== '/api/data') {
    res.writeHead(404);
    return res.end('404: Resource not found');
  };
  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end('405: Method Not Allowed');
  };

  ; (async () => {
    const client = await pool.connect();
    try {
      const page = url.searchParams.get('page') || 1;
      const limit = url.searchParams.get('limit') || PAGE_SIZE;


      const filterByRaw = url.searchParams.get('filter_by');
      const filterBy = ['name', 'qty', 'distance'].includes(filterByRaw)
        ? filterByRaw
        : undefined;
      const filterConditionRaw = url.searchParams.get('filter_condition');
      const filterCondition = ['eq', 'gt', 'lt', 'like'].includes(filterConditionRaw)
        ? condition[filterConditionRaw]
        : undefined;
      const filterValue = url.searchParams.get('filter_value');

      const hasFilter = filterBy && filterCondition && filterValue;

      const orderByRaw = url.searchParams.get('order_by')?.toLowerCase();
      const orderBy = ['id', 'date', 'name', 'qty', 'distance'].includes(orderByRaw)
        ? orderByRaw
        : 'date';
      const orderRaw = url.searchParams.get('order')?.toUpperCase();
      const order = ['ASC', 'DESC'].includes(orderRaw)
        ? orderRaw
        : 'DESC';

      const offset = (page - 1) * limit;

      const values = [offset, limit];
      if (hasFilter) {
        values.push(filterCondition === condition.like ? `%${filterValue}%` : filterValue);
      }

      const { rows } = await client.query(`
        SELECT *, count(*) OVER() AS total FROM test_data
        ${hasFilter ? ` WHERE ${filterBy} ${filterCondition} $3 ` : ''}
        ORDER BY ${orderBy} ${order}
        OFFSET $1 LIMIT $2
      `, values);

      const total = Number(rows[0]?.total) || 0
      const items = rows.map((row) => {
        delete row.total;
        return row;
      })

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ total, items }));
    } catch (err) {
      res.writeHead(500);
      res.end('Server error');
      console.error(err);
    } finally {
      client.release();
    }
  })()

});

server.listen(SERVER_PORT, () => {
  console.info(`Server is running on port ${SERVER_PORT}`);
});