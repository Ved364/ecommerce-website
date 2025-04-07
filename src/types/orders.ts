export type IOrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type IOrderDetail = {
  date: string;
  items: Record<string, IOrderItem>;
  totalAmount: number;
};

export type IUserOrdersMap = Record<string, Record<string, IOrderDetail>>;

export type IOrder = {
  orderId: string;
  date: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
};
