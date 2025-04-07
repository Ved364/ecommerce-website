"use client";

import ProductForm from "@/components/product-form";
import { useParams } from "next/navigation";

const EditProductsPage = () => {
  const params = useParams();
  const id = params?.id;
  return (
    <>
      <ProductForm id={id?.toString()} />
    </>
  );
};

export default EditProductsPage;
