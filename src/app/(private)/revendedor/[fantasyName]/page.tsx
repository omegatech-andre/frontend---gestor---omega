'use client'
import { ResellerGetDetails } from "@/types/resellerDetails";
import useGet from "../../../../hooks/useGet";
import { use, useEffect } from "react";
import PageRevendedor from "@/components/pages/revendedor/pageRevendedor";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

interface Props {
  params: Promise<{ fantasyName: string }>
}

export default function page({ params }: Props) {
  const resolvedParams = use(params);

  const { isGetting, response, error, sendRequest } = useGet<ResellerGetDetails>(`${API_BASE_URL}/resellers/${resolvedParams.fantasyName}`);

  useEffect(() => {
    sendRequest();
  }, []);

  useEffect(() => {
    if (!isGetting && error) {
      window.location.replace('/revendedores')
    }
  }, [isGetting, error]);

  if (!response) return;

  return <PageRevendedor reseller={response.data} />;
}
