import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import { SERVER_HOST, SERVER_PORT, PAGE_SIZE } from './config';
import DataTable from './components/DataTable';
import { Items, ServerResponse } from './types';
import Pagination from './components/Pagination';


function App() {
  const [items, setItems] = useState<Items>([]);
  const [pageQty, setPageQty] = useState(0);
  const [page, setPage] = useState(1);


  useEffect(() => {
    axios.get<ServerResponse>(`http://${SERVER_HOST}:${SERVER_PORT}/api/data`, {
      params: {
        page,
      }
    })
    .then(function (response) {
      console.log(response.data);
      setItems(response.data.items)
      setPageQty(Math.ceil(response.data.total / PAGE_SIZE))
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }, [page])
  
  return (
    <main className="container">
      <DataTable items={items} />
      <Pagination pageQty={pageQty} page={page} setPage={setPage} />
    </main>
  );
}

export default App;
