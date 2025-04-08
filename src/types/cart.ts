import { IProducts } from "./products";

export type ICartProduct = {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
};

export type IUserCartMap = Map<string, IProducts>;

export type ICartMap = Map<string, IUserCartMap>;
