'use client'
import useGet from "../../../../../hooks/useGet";
import { use, useEffect } from "react";
import { CategoryGetDetails } from "@/types/categoryDetails";
import PageCategoria from "@/components/pages/produto/categoria/pageCategoria";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

interface Props {
  params: Promise<{ categoryName: string }>
}

export default function page({ params }: Props) {
  const resolvedParams = use(params);

  const { isGetting, response, error, sendRequest } = useGet<CategoryGetDetails>(`${API_BASE_URL}/categories/${resolvedParams.categoryName}`);

  useEffect(() => {
    sendRequest();
  }, []);

  useEffect(() => {
    if (!isGetting && error) {
      window.location.replace('/produtos')
    }
  }, [isGetting, error]);

  if (!response) return;

  return <PageCategoria category={response.data} />;
}
