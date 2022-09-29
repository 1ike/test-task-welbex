export interface Item {
  id: number,
  date: string,
  name: string,
  qty: number,
  distance: string,
};

export type Items = Item[];

export interface ServerResponse {
  items: Item[],
  total: number,
};
