import { IProducts } from "@/types/products";

export const getProducts = (): IProducts[] => {
  return JSON.parse(localStorage.getItem("products") || "[]");
};

export const setProducts = (items: IProducts[]) => {
  localStorage.setItem("products", JSON.stringify(items));
};
