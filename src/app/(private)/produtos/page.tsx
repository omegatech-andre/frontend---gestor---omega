'use client'
import PageProdutos from "@/components/pages/produtos/pageProdutos";
import useGet from "@/hooks/useGet";
import { CategoryGetDetails } from "@/types/categoryDetails";
import { LineGetDetails } from "@/types/lineDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { useEffect } from "react";

export default function Page() {
  const { response: lines, sendRequest: sendRequestLines } = useGet<LineGetDetails[]>(`${API_BASE_URL}/lines`);
  const { response: categories, sendRequest: sendRequestCategories } = useGet<CategoryGetDetails[]>(`${API_BASE_URL}/categories`);
  // const { data: productsData } = useGet<productDetails[]>(`${API_BASE_URL}/product`);
  const productsData = 'produtos'; // TODO

  useEffect(() => {
    sendRequestLines();
    sendRequestCategories();
  }, [])

  if (!lines || !categories) return;

  return <PageProdutos lines={lines.data} categories={categories.data} products={productsData} />
}
