'use client'
import PageProdutos from "@/components/pages/produtos/pageProdutos";
import useGet from "@/hooks/useGet";
import { LineGetDetails } from "@/types/lineDetails";
import { useEffect } from "react";

export default function Page() {
  const { response: lines, sendRequest } = useGet<LineGetDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/lines`);
  // const { data: categoriesData } = useGet<CategoryDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/category`);
  // const { data: productsData } = useGet<productDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/product`);
  const categoriesData = 'category'; // TODO
  const productsData = 'produtos'; // TODO

  useEffect(() => {
    sendRequest();
  }, [])

  if (!lines) return;

  // Mapeando as categorias para substituir FK_LINE_ID pelo nome da linha
  // const categoriesWithLineNames = categoriesData.map(category => ({
  //   ...category,
  //   FK_LINE_ID: lines.find(line => line._id === category.FK_LINE_ID)?.LINE_NAME || category.FK_LINE_ID
  // }));

  // Renderizando o componente com os dados modificados
  return <PageProdutos lines={lines.data} categories={categoriesData} products={productsData} />
}
