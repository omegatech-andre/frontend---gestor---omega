'use client'
import PageProdutos from "@/components/pages/produtos/pageProdutos";
import useGet from "@/hooks/useGet";
import { CategoryGetDetails } from "@/types/categoryDetails";
import { LineGetDetails } from "@/types/lineDetails";
import { useEffect } from "react";

export default function Page() {
  const { response: lines, sendRequest: sendRequestLines } = useGet<LineGetDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/lines`);
  const { response: categories, sendRequest: sendRequestCategories } = useGet<CategoryGetDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`);
  // const { data: productsData } = useGet<productDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/product`);
  const productsData = 'produtos'; // TODO

  useEffect(() => {
    sendRequestLines();
    sendRequestCategories();
  }, [])

  if (!lines || !categories) return;

  const categoriesWithLineNames = categories.data.map(category => ({
    ...category,
    FK_CATEGORY_LINE: lines.data.find(line => line.id === category.FK_CATEGORY_LINE)?.LINE_NAME || category.FK_CATEGORY_LINE,
  }));

  return <PageProdutos lines={lines.data} categories={categoriesWithLineNames} products={productsData} />
}
