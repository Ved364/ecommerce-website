import { IProducts } from "./products";

export type ICartProduct = {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
};

export type ICartMap = Record<string, Record<string, IProducts>>;

export type IUserCartMap = Record<string, IProducts>;
