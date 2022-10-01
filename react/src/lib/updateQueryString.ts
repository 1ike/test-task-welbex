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

export type FilterByParamValue = Exclude<OrderByParamValue, OrderByParamValue.date>
interface FilterByParam {
  key: 'filter_by';
  value: FilterByParamValue;
}

export enum FilterConditionParamValue {
  eq = 'eq',
  gt = 'gt',
  lt = 'lt',
  like = 'like',
}
interface FilterConditionParam {
  key: 'filter_condition';
  value: FilterConditionParamValue;
}

interface FilterValueParam {
  key: 'filter_value';
  value: string;
}


export interface QueryParams extends Array<
  PageParam | OrderByParam | OrderParam | FilterByParam | FilterConditionParam | FilterValueParam
> { };

function useQueryString(params: QueryParams = []) {
  const { location } = window;
  const url = new URL([location.protocol, '//', location.host, location.pathname].join(''));

  params.forEach(({ key, value }) => {
    const pageParamName = 'page';
    if (key === pageParamName && value === 1) {
      url.searchParams.delete(pageParamName)
    } else {
      url.searchParams.set(key, String(value));
    }
  })

  window.history.pushState(null, '', url);
}

export default useQueryString;
