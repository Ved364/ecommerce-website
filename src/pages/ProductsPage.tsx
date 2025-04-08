"use client";

import AuthGuard from "@/components/auth-guard";
import { useGlobalContext } from "@/context/global-context";
import { IProducts } from "@/types/products";
import { getProducts } from "@/utils/products";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "sonner";

const ProductsPage = () => {
  const [productsData, setProductsData] = useState<IProducts[]>([]);

  const {
    cartMap,
    handleCartMap,
    user,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useGlobalContext();

  const handleAddToCart = (product: IProducts) => {
    const { id, image, title, price } = product;
    const cartProduct = {
      id,
      image,
      title,
      price,
      quantity: 1,
    };

    const userCartMap = cartMap.get(user) ?? new Map();
    const existingProduct = userCartMap.get(id.toString());

    if (existingProduct) {
      existingProduct.quantity += 1;
      userCartMap.set(id.toString(), existingProduct);
    } else {
      toast.success("Product successfully added to cart!", { duration: 1500 });
      userCartMap.set(id.toString(), cartProduct);
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

  useEffect(() => {
    setProductsData(getProducts());
  }, []);
  return (
    <>
      <AuthGuard>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" pb={3}>
              Products
            </Typography>
            {user === "admin@microfox.co" && (
              <Card sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Link
                  href="/product/add"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontSize: "18px",
                    padding: "10px 15px",
                    backgroundColor: "#1976d3",
                  }}
                >
                  Add Product
                </Link>
              </Card>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {productsData.length > 0 ? (
              productsData.map((product) => (
                <Card
                  key={product.id}
                  elevation={6}
                  sx={{
                    width: "345px",
                    height: "450px",
                    alignSelf: "normal",
                    justifySelf: "normal",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="50%"
                    image={product.image}
                    alt={product.title}
                    sx={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <Typography variant="h6" padding="5px">
                      <Tooltip title={product.title}>
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "250px",
                          }}
                        >
                          {product.title}
                        </Box>
                      </Tooltip>
                    </Typography>
                    <Typography variant="h5" padding="5px">
                      {product.price}
                    </Typography>
                    {product.quantity === 0 && (
                      <Typography variant="h5" color="error">
                        Out of Stock
                      </Typography>
                    )}
                    {getCartProductCount(product.id) === 0 &&
                    product.quantity > 0
                      ? product.quantity > 0 && (
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        )
                      : product.quantity > 0 && (
                          <Box
                            sx={{
                              width: 100,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              onClick={() => handleRemoveFromCart(product)}
                            >
                              <RemoveIcon sx={{ cursor: "pointer" }} />
                            </IconButton>
                            {getCartProductCount(product.id)}
                            <IconButton
                              onClick={() => handleAddToCart(product)}
                              disabled={
                                getCartProductCount(product.id) >=
                                product.quantity
                              }
                            >
                              <AddIcon sx={{ cursor: "pointer" }} />
                            </IconButton>
                          </Box>
                        )}
                    <br />
                    {user === "admin@microfox.co" && (
                      <Card
                        sx={{
                          display: "inline-block",
                          alignItems: "center",
                          backgroundColor: "#1976d3",
                          mt: "15px",
                        }}
                      >
                        <Link
                          href={`/product/edit/${product.id}`}
                          style={{
                            textDecoration: "none",
                            color: "white",
                            fontSize: "18px",
                            padding: "10px 15px",
                            display: "inline-block",
                          }}
                        >
                          Edit
                        </Link>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card sx={{ padding: "20px", textAlign: "center" }} elevation={6}>
                <Typography variant="h5" color="textSecondary">
                  No products available. Please add products.
                </Typography>
              </Card>
            )}
          </Box>
        </Container>
      </AuthGuard>
    </>
  );
};

export default ProductsPage;
