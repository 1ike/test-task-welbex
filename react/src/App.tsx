import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import { SERVER_HOST, SERVER_PORT } from './config';
import DataTable from './components/DataTable';


function App() {
  const [items, setItems] = useState([]);
  const [pageQty, setPageQty] = useState(0);
  const [page, setPage] = useState();


  useEffect(() => {
    axios.get(`http://${SERVER_HOST}:${SERVER_PORT}/api/data`, {
      params: {
        page,
      }
    })
    .then(function (response) {
      console.log(response.data);
      setItems(response.data.items)
      setPageQty(response.data.pageQty)
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
    </main>
  );
}

export default App;
