import Table from 'react-bootstrap/Table';

import { Items } from '../../types';
import './DataTable.scss';


interface Props {
  items: Items,
}

function DataTable({ items }: Props) {

  console.log('items = ', items);
  if (items?.length === 0) return <p>'No data available.'</p>

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Название</th>
          <th>Количество</th>
          <th>Расстояние</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.date}</td>
            <td>{item.name}</td>
            <td>{item.qty}</td>
            <td>{item.distance}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;
