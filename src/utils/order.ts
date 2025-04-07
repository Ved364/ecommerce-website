import { IUserCartMap } from "@/types/cart";

export const getOrder = (loggedInUser: string) => {
  const orderKey = localStorage.getItem("orders");
  const orders = orderKey ? JSON.parse(orderKey) : {};
  return orders[loggedInUser] ?? {};
};

export const setOrder = (
  loggedInUser: string,
  userCart: IUserCartMap,
  totalAmount: number
) => {
  const orderKey = localStorage.getItem("orders");
  const orders = orderKey ? JSON.parse(orderKey) : {};

  const userOrders = orders[loggedInUser] ?? {};

  const orderId = `order_${Date.now()}`;

  const orderDetails = {
    date: new Date().toISOString(),
    items: userCart,
    totalAmount,
  };

  userOrders[orderId] = orderDetails;

  orders[loggedInUser] = userOrders;

  localStorage.setItem("orders", JSON.stringify(orders));
};
