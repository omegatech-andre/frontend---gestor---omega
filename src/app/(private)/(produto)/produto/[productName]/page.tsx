'use client'
import useGet from "../../../../../hooks/useGet";
import { use, useEffect } from "react";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { ProductGetDetails } from "@/types/productDetails";
import PageProduto from "@/components/pages/produto/produto/pageProduto";

interface Props {
  params: Promise<{ productName: string }>
}

export default function page({ params }: Props) {
  const resolvedParams = use(params);

  const { isGetting, response, error, sendRequest } = useGet<ProductGetDetails>(`${API_BASE_URL}/products/${resolvedParams.productName}`);

  useEffect(() => {
    sendRequest();
  }, []);

  useEffect(() => {
    if (!isGetting && error) {
      window.location.replace('/produtos')
    }
  }, [isGetting, error]);

  if (!response) return;

  return <PageProduto product={response.data} />;
}
