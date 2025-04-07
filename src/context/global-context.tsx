"use client";

import { ICartMap, IUserCartMap } from "@/types/cart";
import { getCart, getStorageCart, setCart } from "@/utils/cart";
import {
  getLoggedInUser,
  removeLoggedInUser,
  setLoggedInUser,
} from "@/utils/login";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type IGlobalContext = {
  login: (loggedInUser: string) => void;
  logout: VoidFunction;
  user: string;
  handleCartMap: (userCartMap: IUserCartMap) => void;
  cartMap: ICartMap;
  cartQuantity: number;
  incrementCartQuantity: () => void;
  decrementCartQuantity: () => void;
};

export const GlobalContext = createContext({} as IGlobalContext);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string>("");
  const [cartMap, setCartMap] = useState<ICartMap>({});
  const [cartQuantity, setCartQuantity] = useState(0);

  const login = (loggedInUser: string) => {
    setLoggedInUser(loggedInUser);
    setUser(loggedInUser);
    redirect("/");
  };

  const logout = () => {
    removeLoggedInUser();
    setUser("");
    redirect("/login");
  };

  const handleCartMap = (userCartMap: IUserCartMap) => {
    const newCartMap = {
      ...cartMap,
      [user]: userCartMap,
    };
    setCartMap(newCartMap);
    setCart(user, userCartMap);
  };

  const incrementCartQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const decrementCartQuantity = () => {
    setCartQuantity((prev) => prev - 1);
  };

  useEffect(() => {
    const cart = getStorageCart();
    setCartMap(cart);

    const user = getLoggedInUser();
    if (user) {
      const userCart = getCart(user);

      const totalQuantity: number = Object.values(userCart)?.reduce(
        (acc, product) => {
          return acc + product.quantity;
        },
        0
      );

      setUser(user);
      setCartQuantity(totalQuantity);
    }
  }, [user]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          login,
          logout,
          user,
          handleCartMap,
          cartMap,
          cartQuantity,
          incrementCartQuantity,
          decrementCartQuantity,
        }}
      >
        {children}
      </GlobalContext.Provider>
    </>
  );
};
