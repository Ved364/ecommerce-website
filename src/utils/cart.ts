import { ICartMap, IUserCartMap } from "@/types/cart";

export const getStorageCart = (): ICartMap => {
  return JSON.parse(localStorage.getItem("cart") || "{}");
};

export const setStorageCart = (cart: ICartMap) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = (loggedInUser: string): IUserCartMap => {
  const cartKey = localStorage.getItem("cart");
  const cart = cartKey ? JSON.parse(cartKey) : {};
  return cart[loggedInUser] ?? {};
};

export const setCart = (loggedInUser: string, userCart: IUserCartMap) => {
  const cartKey = localStorage.getItem("cart");
  const cart = cartKey ? JSON.parse(cartKey) : {};
  cart[loggedInUser] = userCart;
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeUserFromCart = (loggedInUser: string) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  delete cart[loggedInUser];
  localStorage.setItem("cart", JSON.stringify(cart));
};
