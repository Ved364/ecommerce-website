import { Card } from "@mui/material";
import Link from "next/link";

const GoToProductsButton = () => (
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
);

export default GoToProductsButton;
