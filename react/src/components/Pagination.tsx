import BootstrapPagination from 'react-bootstrap/Pagination';


interface Props {
  pageQty: number,
  page: number,
  setPage(page: number): void,
}

function Pagination({ pageQty, page, setPage }: Props) {
  let buttons = [];
  for (let number = 1; number <= pageQty; number++) {
    buttons.push(
      <BootstrapPagination.Item
        key={number}
        active={number === page}
        onClick={() => setPage(number)}
      >
        {number}
      </BootstrapPagination.Item>,
    );
  }

  return (
    <BootstrapPagination>{buttons}</BootstrapPagination>
  );
}

export default Pagination;
