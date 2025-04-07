"use client";

import AuthGuard from "@/components/auth-guard";
import CustomTable from "@/components/custom-table";
import { ITableColumn } from "@/types/common";
import { IOrder, IUserOrdersMap, IOrderDetail } from "@/types/orders";
import { Box, Card, Container, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const COLUMNS: ITableColumn[] = [
  { key: "orderId", label: "Order Id" },
  { key: "date", label: "Date & Time" },
  { key: "productId", label: "Product-Id" },
  { key: "title", label: "Title" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "total", label: "Total" },
];

const OrdersPage = () => {
  const [ordersByUser, setOrdersByUser] = useState<Record<string, IOrder[]>>(
    {}
  );

  useEffect(() => {
    const ordersData: IUserOrdersMap = JSON.parse(
      localStorage.getItem("orders") || "{}"
    );

    const formattedOrders: Record<string, IOrder[]> = {};

    Object.entries(ordersData).forEach(([userEmail, userOrders]) => {
      const userOrderList: IOrder[] = [];

      Object.entries(userOrders).forEach(
        ([orderId, orderData]: [string, IOrderDetail]) => {
          const { date, items } = orderData;

          Object.entries(items).forEach(([productId, product]) => {
            userOrderList.push({
              orderId,
              date: new Date(date).toLocaleString(),
              productId,
              title: product.title,
              price: product.price,
              quantity: product.quantity,
              total: product.price * product.quantity,
            });
          });
        }
      );

      formattedOrders[userEmail] = userOrderList;
    });

    setOrdersByUser(formattedOrders);
  }, []);

  return (
    <AuthGuard>
      <Container sx={{ padding: "25px" }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Orders
        </Typography>

        <Box justifySelf="flex-end">
          <Card
            sx={{
              display: "inline-block",
              alignItems: "center",
              backgroundColor: "#1976d3",
              mt: "15px",
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                fontSize: "18px",
                padding: "10px 15px",
                display: "inline-block",
              }}
            >
              Go to Products
            </Link>
          </Card>
        </Box>

        {Object.keys(ordersByUser).length > 0 ? (
          Object.entries(ordersByUser).map(([user, orders]) => (
            <Box key={user} sx={{ my: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 3 }}>
                User: {user}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <CustomTable columns={COLUMNS} data={orders} />
            </Box>
          ))
        ) : (
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginTop: "20px" }}
          >
            No orders found.
          </Typography>
        )}
      </Container>
    </AuthGuard>
  );
};

export default OrdersPage;
