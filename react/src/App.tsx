import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import { SERVER_HOST, SERVER_PORT } from './config';
import DataTable from './components/DataTable';


function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState();


  useEffect(() => {
    axios.get(`http://${SERVER_HOST}:${SERVER_PORT}/api/data`, {
      params: {
        page,
      }
    })
    .then(function (response) {
      console.log(response.data);
      setData(response.data)
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
      <DataTable items={data} />
    </main>
  );
}

export default App;
