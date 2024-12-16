'use client'
import PageProdutos from "@/components/pages/produtos/pageProdutos";
import useGet from "@/hooks/useGet";
import { CategoryGetDetails } from "@/types/categoryDetails";
import { LineGetDetails } from "@/types/lineDetails";
import { ProductGetDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { useEffect } from "react";

export default function Page() {
  const { response: lines, sendRequest: sendRequestLines } = useGet<LineGetDetails[]>(`${API_BASE_URL}/lines`);
  const { response: categories, sendRequest: sendRequestCategories } = useGet<CategoryGetDetails[]>(`${API_BASE_URL}/categories`);
  const { response: products, sendRequest: sendRequestProducts } = useGet<ProductGetDetails[]>(`${API_BASE_URL}/products`);

  useEffect(() => {
    sendRequestLines();
    sendRequestCategories();
    sendRequestProducts();
  }, [])

  if (!lines || !categories || !products) return;

  return <PageProdutos lines={lines.data} categories={categories.data} products={products.data} />
}
