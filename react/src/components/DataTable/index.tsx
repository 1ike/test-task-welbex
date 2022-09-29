import Table from 'react-bootstrap/Table';

import { OrderByParamValue, OrderParamValue } from '../../lib/updateQueryString';
import { Items } from '../../types';
import './DataTable.scss';


type SetOrderCallback = (order: OrderParamValue | null) => OrderParamValue;

interface Props {
  items: Items,
  orderBy: OrderByParamValue | null,
  order: OrderParamValue | null,
  setOrderBy(orderBy: OrderByParamValue): void,
  setOrder(arg: OrderParamValue | SetOrderCallback): void,
}

function DataTable({ items, orderBy, order, setOrderBy, setOrder }: Props) {
  const setSort = (field: OrderByParamValue) => {
    if (field === orderBy) {
      setOrder((prev) => prev === OrderParamValue.ASC ? OrderParamValue.DESC : OrderParamValue.ASC);
    } else {
      setOrder(OrderParamValue.DESC);
    }

    setOrderBy(field);
  }

  const renderOrder = (field: OrderByParamValue) => {
    if (field !== orderBy) return null;

    return order === OrderParamValue.ASC ? <span>&uarr;</span> : <span>&darr;</span>;
  };


  if (items?.length === 0) return <p>'No data available.'</p>

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Дата</th>
          <th onClick={() => setSort(OrderByParamValue.name)}>
            Название {renderOrder(OrderByParamValue.name)}
          </th>
          <th onClick={() => setSort(OrderByParamValue.qty)}>
            Количество {renderOrder(OrderByParamValue.qty)}
          </th>
          <th onClick={() => setSort(OrderByParamValue.distance)}>
            Расстояние {renderOrder(OrderByParamValue.distance)}
          </th>
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
