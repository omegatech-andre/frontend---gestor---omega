'use client'
import { use, useEffect } from "react";
import { LineGetDetails } from "@/types/lineDetails";
import useGet from "@/hooks/useGet";
import PageLinha from "@/components/pages/produto/linha/pageLinha";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

interface Props {
  params: Promise<{ lineName: string }>
}

export default function page({ params }: Props) {
  const resolvedParams = use(params);

  const { isGetting, response, error, sendRequest } = useGet<LineGetDetails>(`${API_BASE_URL}/lines/${resolvedParams.lineName}`);

  useEffect(() => {
    sendRequest();
  }, []);

  useEffect(() => {
    if (!isGetting && error) {
      window.location.replace('/produtos')
    }
  }, [isGetting, error]);

  if (!response) return;

  return <PageLinha line={response.data} />;
}
