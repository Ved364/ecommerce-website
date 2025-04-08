import { IUserCartMap } from "@/types/cart";

import { ICartProduct } from "@/types/cart";

export const getOrder = (loggedInUser: string): Map<string, ICartProduct> => {
  const orderKey = localStorage.getItem("orders");
  const orders = orderKey ? JSON.parse(orderKey) : {};
  const userOrders = orders[loggedInUser] ?? {};

  const latestOrderKey = Object.keys(userOrders).sort().reverse()[0];
  const latestOrder = userOrders[latestOrderKey];

  if (!latestOrder || !latestOrder.items) return new Map();

  return new Map(Object.entries(latestOrder.items));
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
    items: Object.fromEntries(userCart),
    totalAmount,
  };

  userOrders[orderId] = orderDetails;

  orders[loggedInUser] = userOrders;

  localStorage.setItem("orders", JSON.stringify(orders));
};
