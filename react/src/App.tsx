import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import { SERVER_HOST, SERVER_PORT, PAGE_SIZE } from './config';
import DataTable from './components/DataTable';
import { Items, ServerResponse } from './types';
import Pagination from './components/Pagination';
import
updateQueryString,
{ OrderByParamValue, OrderParamValue, QueryParams }
  from './lib/updateQueryString';
import Filter, { FilterState } from './components/Filter';


function App() {
  const [items, setItems] = useState<Items>([]);
  const [pageQty, setPageQty] = useState(0);

  const [page, setPage] = useState(1);

  const [orderBy, setOrderBy] = useState<OrderByParamValue | null>(null);
  const [order, setOrder] = useState<OrderParamValue | null>(null);

  const [filter, setFilter] = useState<FilterState | null>(null);

console.log('filter = ', filter);
  useEffect(() => {
    const queryParams: QueryParams = [{ key: 'page', value: page }];
    if (orderBy) queryParams.push({ key: 'order_by', value: orderBy });
    if (order) queryParams.push({ key: 'order', value: order });
    if (filter) {
      queryParams.push({ key: 'filter_by', value: filter.field });
      queryParams.push({ key: 'filter_condition', value: filter.condition });
      queryParams.push({ key: 'filter_value', value: filter.value });
    }
    updateQueryString(queryParams);


    axios.get<ServerResponse>(`http://${SERVER_HOST}:${SERVER_PORT}/api/data`, {
      params: {
        page,
        ...(orderBy && { order_by: orderBy }),
        ...(order && { order }),
        ...(filter && { filter_by: filter.field }),
        ...(filter && { filter_condition: filter.condition }),
        ...(filter && { filter_value: filter.value }),
      }
    })
      .then(function (response) {
        setItems(response.data.items)
        setPageQty(Math.ceil(response.data.total / PAGE_SIZE))
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, [page, orderBy, order, filter]);

  return (
    <main className="container">
      <Filter filter={filter} setFilter={setFilter} />
      <DataTable
        items={items}
        orderBy={orderBy}
        order={order}
        setOrderBy={setOrderBy}
        setOrder={setOrder}
      />
      <Pagination pageQty={pageQty} page={page} setPage={setPage} />
    </main>
  );
}

export default App;
