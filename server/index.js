import http from 'http';
import * as pg from 'pg'


const { Pool } = pg.default;
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'pass',
  database: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})


const server = http.createServer((req, res) => {
  const url = new URL(`${req.protocol}://${req.host}${req.url}`);

  if(url.pathname !== '/api/data' || req.method !== 'GET') {
    res.writeHead(404);
    return res.end('404: Resource not found');
  };

  ;(async () => {
    const client = await pool.connect()
    try {
      const page = url.searchParams.get('page') || 1;
      const limit = url.searchParams.get('limit') || 10;
      const filter = url.searchParams.get('filter');

      const offset = (page - 1) * limit;

      const { rows: data } = await client.query('SELECT * FROM test_data OFFSET $1 LIMIT $2 ' , [offset, limit])

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500);
      res.end('Server error');
      console.error(err)
    } finally {
      client.release()
    }
  })()

});

server.listen(8000);