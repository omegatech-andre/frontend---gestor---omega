import { Text } from "@mantine/core";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  return (
    <>
      <Text w='100vw' p='lg' bg='blue'>olá {session.user.USER_NAME} esse é meu layout privado</Text>
      {children}
    </>
  );
}
