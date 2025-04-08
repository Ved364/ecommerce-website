"use client";

import AuthGuard from "@/components/auth-guard";
import CustomTable from "@/components/custom-table";
import { useGlobalContext } from "@/context/global-context";
import { ITableColumn } from "@/types/common";
import { IOrder, IOrderDetail, IUserOrdersMap } from "@/types/orders";
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
  const [userOrders, setUserOrders] = useState<IOrder[]>([]);

  const { user } = useGlobalContext();

  useEffect(() => {
    const ordersData: IUserOrdersMap = JSON.parse(
      localStorage.getItem("orders") || "{}"
    );

    if (ordersData[user]) {
      const currentUserOrders = ordersData[user];
      const flattenedOrders: IOrder[] = [];

      Object.entries(currentUserOrders).forEach(
        ([orderId, orderDetail]: [string, IOrderDetail]) => {
          const { date, items } = orderDetail;

          const itemsMap = new Map(Object.entries(items));

          itemsMap.forEach((item, productId) => {
            flattenedOrders.push({
              orderId,
              date: new Date(date).toLocaleString(),
              productId,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
            });
          });
        }
      );

      setUserOrders(flattenedOrders);
    }
  }, [user]);

  return (
    <AuthGuard>
      <Container sx={{ padding: "25px" }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Your Orders
        </Typography>

        <Box sx={{ justifySelf: "flex-end" }}>
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

        {userOrders.length > 0 ? (
          <Box sx={{ my: 4 }}>
            <Divider sx={{ my: 2 }} />
            <CustomTable columns={COLUMNS} data={userOrders} />
          </Box>
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
