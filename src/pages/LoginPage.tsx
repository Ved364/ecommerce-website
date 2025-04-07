"use client";

import { useGlobalContext } from "@/context/global-context";
import { getLoggedInUser } from "@/utils/login";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");

  const { login } = useGlobalContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  useEffect(() => {
    const user = getLoggedInUser();
    if (user) {
      redirect("/");
    }
  });
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: "500px", height: "250px" }}>
          <CardHeader title="Login" sx={{ justifySelf: "center" }} />
          <CardContent
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              label="Email"
              placeholder="xyz@gmail.com"
              fullWidth
            />
            <Button type="submit" variant="contained">
              Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;
