"use client";

import AuthGuard from "@/components/auth-guard";
import { useGlobalContext } from "@/context/global-context";
import { ICartProduct, IUserCartMap } from "@/types/cart";
import { getCart, removeUserFromCart } from "@/utils/cart";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import GoToProductsButton from "@/components/go-to-products-button";
import { IProducts } from "@/types/products";
import { redirect } from "next/navigation";
import { getProducts, setProducts } from "@/utils/products";
import { setOrder } from "@/utils/order";

type IUpdatedProduct = Record<string, IProducts | ICartProduct>;

const CartPage = () => {
  const [cartData, setCartData] = useState<IUserCartMap>({});
  const [updatedProducts, setUpdatedProducts] = useState<IUpdatedProduct[]>([]);
  const [priceMismatch, setPriceMismatch] = useState(false);

  const {
    cartMap,
    handleCartMap,
    user,
    incrementCartQuantity,
    decrementCartQuantity,
    cartQuantity,
  } = useGlobalContext();
  console.log("cartPage: ", cartMap);

  const handleAddToCart = (product: IProducts) => {
    const { id } = product;

    const userCartMap = cartMap[user] ?? {};

    if (userCartMap[id]) {
      userCartMap[id].quantity += 1;
    }
    handleCartMap(userCartMap);
    incrementCartQuantity();
  };

  const handleRemoveFromCart = (product: IProducts) => {
    const { id } = product;
    const userCartMap = cartMap[user] ?? {};

    if (userCartMap[id]) {
      if (userCartMap[id].quantity > 1) {
        userCartMap[id].quantity -= 1;
      } else {
        delete userCartMap[id];
      }
    }

    handleCartMap(userCartMap);
    decrementCartQuantity();
  };

  const getCartProductCount = (productId: string) => {
    return cartMap[user]?.[productId]?.quantity ?? 0;
  };

  const totalAmount = Object.values(cartData).reduce(
    (acc, item) => acc + (cartData[item.id]?.quantity * item.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    const userCart = cartMap[user] ?? {};

    const products = getProducts();

    const updatedProducts = products.map((product) => {
      const cartItem = userCart[product.id];
      if (cartItem) {
        return {
          ...product,
          quantity: product.quantity - cartItem.quantity,
        };
      }
      return product;
    });

    const hasInsufficientStock = updatedProducts.some(
      (product: IProducts) => product.quantity < 0
    );

    if (hasInsufficientStock) {
      alert("Order cannot be placed due to insufficient stock.");
      return;
    }

    setOrder(user, userCart, totalAmount);

    setProducts(updatedProducts);

    removeUserFromCart(user);

    handleCartMap({});

    for (let i = 0; i < cartQuantity; i++) {
      decrementCartQuantity();
    }

    alert("Order placed successfully!");
    redirect("/");
  };

  useEffect(() => {
    const userCart = getCart(user);
    const products: IProducts[] = getProducts();

    const updatedCart: IUserCartMap = { ...userCart };
    let mismatchFound = false;
    const newProducts: IUpdatedProduct[] = [];

    products.forEach((product) => {
      const cartItem = userCart[product.id];

      if (cartItem && cartItem.price !== product.price) {
        mismatchFound = true;

        newProducts.push({
          old: cartItem,
          new: product,
        });

        updatedCart[product.id] = {
          ...cartItem,
          price: product.price,
        };
      }
    });

    if (mismatchFound) {
      setPriceMismatch(true);
      setUpdatedProducts(newProducts);
      handleCartMap(updatedCart);
    }

    setCartData(updatedCart);
  }, [user, cartMap, handleCartMap]);

  return (
    <>
      <AuthGuard>
        <Container>
          <Typography variant="h4" textAlign="center" mt={3}>
            Cart
          </Typography>
          {priceMismatch && updatedProducts.length > 0 && (
            <Box
              sx={{
                backgroundColor: "#fff3cd",
                padding: 2,
                marginY: 2,
                borderRadius: 1,
              }}
            >
              <Typography fontWeight="bold" color="orange">
                ⚠️ Some product prices have changed:
              </Typography>
              {updatedProducts.map((p, idx) => (
                <Typography key={idx}>
                  <strong>{p.old.title}</strong>: ₹{p.old.price} → ₹
                  {p.new.price}
                </Typography>
              ))}
              <Typography mt={1} fontStyle="italic">
                Prices updated. Please review your cart. This warning will
                disappear on page reload.
              </Typography>
            </Box>
          )}
          {Object.values(cartData).length > 0 && <GoToProductsButton />}
          <Box
            sx={{
              margin: "25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {Object.values(cartData).length > 0 ? (
              Object.values(cartData).map((cart) => (
                <Card
                  key={cart.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "70%",
                    margin: "15px",
                  }}
                  elevation={6}
                >
                  <CardMedia
                    component="img"
                    image={cart.image}
                    alt={cart.title}
                    sx={{
                      height: "100px",
                      width: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <CardContent sx={{ width: "100%" }}>
                    <Typography variant="h6">{cart.title}</Typography>
                    <Typography
                      variant="h5"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CurrencyRupeeIcon />
                      {cart.price} * {getCartProductCount(cart.id)}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="green"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CurrencyRupeeIcon />
                      {cart.price * getCartProductCount(cart.id)}
                    </Typography>
                    <Box
                      sx={{
                        width: 100,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <IconButton onClick={() => handleRemoveFromCart(cart)}>
                        <RemoveIcon sx={{ cursor: "pointer" }} />
                      </IconButton>
                      {getCartProductCount(cart.id)}
                      <IconButton onClick={() => handleAddToCart(cart)}>
                        <AddIcon sx={{ cursor: "pointer" }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: "20px" }}
                >
                  Cart is empty.
                </Typography>
                <GoToProductsButton />
              </>
            )}
            <Typography variant="h5">
              Total quantity: {cartQuantity} Total Amount:
              {Math.ceil(totalAmount)}
            </Typography>
          </Box>
          {Object.values(cartData).length > 0 && (
            <Button
              onClick={handlePlaceOrder}
              variant="contained"
              disabled={priceMismatch}
            >
              Place Order
            </Button>
          )}
        </Container>
      </AuthGuard>
    </>
  );
};

export default CartPage;
