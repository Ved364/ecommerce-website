import { ICartMap, IUserCartMap } from "@/types/cart";
import { IProducts } from "@/types/products";

const mapToObject = <T>(map: Map<string, T>): Record<string, T> => {
  return Object.fromEntries(map.entries());
};

const objectToMap = <T>(obj: Record<string, T>): Map<string, T> => {
  return new Map<string, T>(Object.entries(obj));
};

export const getStorageCart = (): ICartMap => {
  const raw = localStorage.getItem("cart");
  const parsed = raw ? JSON.parse(raw) : {};
  const cartMap = new Map<string, IUserCartMap>();

  for (const [user, cart] of Object.entries(parsed)) {
    cartMap.set(user, objectToMap(cart as Record<string, IProducts>));
  }

  return cartMap;
};

export const setStorageCart = (cart: ICartMap) => {
  const obj: Record<string, Record<string, IProducts>> = {};

  for (const [user, userCartMap] of cart.entries()) {
    obj[user] = mapToObject(userCartMap);
  }

  localStorage.setItem("cart", JSON.stringify(obj));
};

export const getCart = (loggedInUser: string): IUserCartMap => {
  const cartMap = getStorageCart();
  return cartMap.get(loggedInUser) ?? new Map();
};

export const setCart = (loggedInUser: string, userCart: IUserCartMap) => {
  const cartMap = getStorageCart();
  cartMap.set(loggedInUser, userCart);
  setStorageCart(cartMap);
};

export const removeUserFromCart = (loggedInUser: string) => {
  const cartMap = getStorageCart();
  cartMap.delete(loggedInUser);
  setStorageCart(cartMap);
};
