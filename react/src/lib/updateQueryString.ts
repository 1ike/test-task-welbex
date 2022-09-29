interface PageParam {
  key: 'page';
  value: number;
}

export enum OrderByParamValue {
  date = 'date',
  name = 'name',
  qty = 'qty',
  distance = 'distance',
}
interface OrderByParam {
  key: 'order_by';
  value: OrderByParamValue;
}

export enum OrderParamValue {
  ASC = 'ASC',
  DESC = 'DESC',
}
interface OrderParam {
  key: 'order';
  value: OrderParamValue;
}

export interface QueryParams extends Array<PageParam | OrderByParam | OrderParam> {};

function useQueryString(params: QueryParams = []) {
  const url = new URL(window.location.href);
  let needUpdate = true;

  params.forEach(({ key, value }) => {
    const pageParamName = 'page';
    if ( key === pageParamName && value === 1) {
      if (url.searchParams.has(pageParamName)) {
        url.searchParams.delete(pageParamName)
      } else {
        needUpdate = false;
      }
    } else {
      url.searchParams.set(key, String(value));
    }
  })

  if (needUpdate) window.history.pushState(null, '', url);
}

export default useQueryString;
