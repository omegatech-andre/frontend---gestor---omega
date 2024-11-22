'use client'
import { Button, Center, Stack, Text } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  console.log(session)

  const logout = async () => {
    await signOut({ redirect: false });
    redirect('/')
  }

  return (
    <Center h='70vh' bg='teal'>
      <Stack>
        <Text>Olá {session?.user.USER_NAME}</Text>
        <Text>esta é minha pagina privada</Text>
        <Button onClick={logout}>Sair</Button>
      </Stack>
    </Center>
  );
}
