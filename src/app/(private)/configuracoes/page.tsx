'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loading from "@/app/loading";
import PageConfiguracoes from "@/components/pages/configuracoes/pageConfiguracoes";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Loading />;
  if (status === 'authenticated' && session?.user.USER_ROLE !== 'ADMIN') redirect('/produtos');

  return <PageConfiguracoes />;
}
