"use client";

import AuthGuard from "@/components/auth-guard";
import { useGlobalContext } from "@/context/global-context";
import { ICartMap, ICartProduct, IUserCartMap } from "@/types/cart";
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
import { toast } from "sonner";

type IUpdatedProduct = Record<string, IProducts | ICartProduct>;

const CartPage = () => {
  const [cartData, setCartData] = useState<ICartMap>(new Map());
  const [productsData, setProductsData] = useState<IProducts[]>([]);
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

  const handleAddToCart = (product: IProducts) => {
    const { id } = product;

    const userCartMap = cartMap.get(user) ?? new Map();
    const existingProduct = userCartMap.get(id.toString());

    if (existingProduct) {
      existingProduct.quantity += 1;
      userCartMap.set(id.toString(), existingProduct);
    }
    handleCartMap(userCartMap);
    incrementCartQuantity();
  };

  const handleRemoveFromCart = (product: IProducts) => {
    const { id } = product;
    const userCartMap = cartMap.get(user) ?? new Map();

    const existingProduct = userCartMap.get(id.toString());

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        userCartMap.set(id.toString(), existingProduct);
      } else {
        toast("Product removed from cart.", { duration: 1500 });
        userCartMap.delete(id.toString());
      }
    }

    handleCartMap(userCartMap);
    decrementCartQuantity();
  };

  const getCartProductCount = (productId: string) => {
    return cartMap.get(user)?.get(productId)?.quantity ?? 0;
  };

  const totalAmount = Array.from(cartData.get(user)?.values() ?? []).reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handlePlaceOrder = () => {
    const userCart = cartMap.get(user) ?? new Map();

    const products = getProducts();

    const updatedProducts = products.map((product) => {
      const cartItem = userCart.get(product.id.toString());
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
      toast.error("Order cannot be placed due to insufficient stock.", {
        duration: 1500,
      });
      return;
    }

    setProducts(updatedProducts);

    setOrder(user, userCart, totalAmount);

    removeUserFromCart(user);

    handleCartMap(new Map());

    for (let i = 0; i < cartQuantity; i++) {
      decrementCartQuantity();
    }

    toast.success("Order placed successfully!", { duration: 1500 });
    redirect("/");
  };

  useEffect(() => {
    const userCart = getCart(user);
    const products: IProducts[] = getProducts();

    const updatedCart: IUserCartMap = new Map(userCart);
    let mismatchFound = false;
    const newProducts: IUpdatedProduct[] = [];

    products.forEach((product) => {
      const cartItem = userCart.get(product.id);

      if (cartItem) {
        if (cartItem.price !== product.price) {
          mismatchFound = true;

          newProducts.push({
            old: cartItem,
            new: product,
          });

          updatedCart.set(product.id, {
            ...cartItem,
            price: product.price,
          });
        }

        if (cartItem.quantity > product.quantity) {
          mismatchFound = true;

          updatedCart.set(product.id, {
            ...cartItem,
            quantity: product.quantity,
          });

          toast.warning(
            `${product.title} quantity reduced to available stock: ${product.quantity}`,
            { duration: 3000 }
          );
        }
      }
    });

    if (mismatchFound) {
      setPriceMismatch(true);
      setUpdatedProducts(newProducts);
      handleCartMap(updatedCart);

      const newTotal = Array.from(updatedCart.values()).reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const diff = cartQuantity - newTotal;
      for (let i = 0; i < diff; i++) {
        decrementCartQuantity();
      }
    }

    setCartData(new Map([[user, userCart]]));
  }, [user, cartMap, handleCartMap, cartQuantity, decrementCartQuantity]);

  useEffect(() => {
    setProductsData(getProducts());
  }, []);

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
          {(cartData.get(user)?.size ?? 0) > 0 && <GoToProductsButton />}
          <Box
            sx={{
              margin: "25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {(cartData.get(user)?.size ?? 0) > 0 ? (
              Array.from(cartData.get(user)?.values() ?? []).map((cart) => (
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
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {(() => {
                        const product = productsData.find(
                          (p) => p.id === cart.id
                        );
                        return product?.quantity === 0 ? (
                          <>
                            <Typography
                              color="red"
                              fontWeight="bold"
                              fontSize="0.9rem"
                            >
                              Out of stock
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleRemoveFromCart(cart)}
                            >
                              Remove from cart
                            </Button>
                          </>
                        ) : (
                          <Box
                            sx={{
                              width: 100,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              onClick={() => handleRemoveFromCart(cart)}
                            >
                              <RemoveIcon sx={{ cursor: "pointer" }} />
                            </IconButton>
                            {getCartProductCount(cart.id)}
                            <IconButton
                              onClick={() => handleAddToCart(cart)}
                              disabled={
                                (product?.quantity ?? 0) -
                                  getCartProductCount(cart.id) <=
                                0
                              }
                            >
                              <AddIcon sx={{ cursor: "pointer" }} />
                            </IconButton>
                          </Box>
                        );
                      })()}
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
          {(cartData.get(user)?.size ?? 0) > 0 && (
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
