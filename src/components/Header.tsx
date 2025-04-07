"use client";

import { useGlobalContext } from "@/context/global-context";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { badgeClasses } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import Link from "next/link";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -20px;
    right: -6px;
  }
`;

const Header = () => {
  const { user, logout, cartQuantity } = useGlobalContext();
  return (
    <>
      <AppBar position="static" sx={{ marginBottom: "25px" }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, cursor: "pointer" }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              Microfox Store
            </Link>
          </Typography>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Link
                href={user === "admin@microfox.co" ? "/orders" : "/my-orders"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "18px",
                }}
              >
                Orders
              </Link>
              <Link
                href="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ShoppingCartIcon fontSize="medium" />
                <CartBadge
                  badgeContent={cartQuantity}
                  color="secondary"
                  overlap="circular"
                />
              </Link>
              <LogoutIcon onClick={logout} sx={{ cursor: "pointer" }} />
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
