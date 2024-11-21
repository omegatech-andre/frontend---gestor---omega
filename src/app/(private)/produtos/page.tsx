'use client'
import { Button, Center, Text } from "@mantine/core";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const logout = async () => {
    await signOut({
      redirect: false,
    });
    redirect('/')
  }

  return (
    <Center h='70vh' bg='teal'>
      <Text>minha pagina privada</Text>
      <Button onClick={logout}>Sair</Button>
    </Center>
  );
}
