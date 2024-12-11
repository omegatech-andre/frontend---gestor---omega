'use client'
import PageRevendedores from "@/components/pages/revendedores/pageRevendedores";
import useGet from "../../../hooks/useGet";
import { ResellerGetDetails } from "@/types/resellerDetails";
import { useEffect } from "react";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

export default function page() {
  const { response, sendRequest } = useGet<ResellerGetDetails[]>(`${API_BASE_URL}/resellers`);

  useEffect(() => {
    sendRequest();
  }, [])

  if (!response) return;

  const totalResellers = response.data.length;
  const activeResellers = response.data.filter(reseller => reseller.RESELLER_STATUS === 'APPROVED').length;
  const pendingResellers = response.data.filter(reseller => reseller.RESELLER_STATUS === 'PENDING').length;
  const inactiveResellers = response.data.filter(reseller => reseller.RESELLER_STATUS === 'DISABLED').length;
  const totalStates = new Set(response.data.map(reseller => reseller.RESELLER_STATE)).size;
  const activeStates = new Set(response.data.filter(reseller => reseller.RESELLER_STATUS === 'APPROVED').map(reseller => reseller.RESELLER_STATE)).size;
  const inactiveStates = new Set(response.data.filter(reseller => reseller.RESELLER_STATUS === 'DISABLED').map(reseller => reseller.RESELLER_STATE)).size;
  const stateCounts = response.data.filter(reseller => reseller.RESELLER_STATUS === 'APPROVED').reduce((acc, reseller) => {
    acc[reseller.RESELLER_STATE] = (acc[reseller.RESELLER_STATE] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <PageRevendedores
      reseller={response.data}
      totalResellers={totalResellers}
      activeResellers={activeResellers}
      pendingResellers={pendingResellers}
      inactiveResellers={inactiveResellers}
      totalStates={totalStates}
      activeStates={activeStates}
      inactiveStates={inactiveStates}
      stateCounts={stateCounts}
    />
  );
}
