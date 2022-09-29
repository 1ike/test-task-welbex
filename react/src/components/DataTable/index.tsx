import Table from 'react-bootstrap/Table';

import './DataTable.scss';


interface Props {
  items: any
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
        {items.map((item: any) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.id}</td>
            <td>{item.id}</td>
            <td>{item.id}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;
