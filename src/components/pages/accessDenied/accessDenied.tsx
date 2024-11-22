'use client'
import ProviderAvatar from "@/components/_ui/avatar/providerAvatar";
import { AppShell, Button, Center, Group, Image, Menu, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AccessDenied() {
  const { data: session } = useSession();
  const message = encodeURIComponent(`Olá, eu preciso de permissão para acessar o sistema de gestão da Ômega Screen com o usuário NOME: *${session?.user.USER_NAME}* - ID: *${session?.user.id}*`);
  const whatsappUrl = `https://wa.me/5581992188720?text=${message}`;

  const logout = async () => {
    await signOut({ redirect: false });
    redirect('/')
  }

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Image src='logo_0.webp' w={40} />
          </Group>
          <Group>
            <Menu>
              <Menu.Target>
                <Group>
                  <Text c="dimmed" size="sm" inline >Olá, {session?.user.USER_NAME}</Text>
                  <UnstyledButton>
                    <ProviderAvatar name={session?.user.USER_NAME || ''} size='2.3rem' />
                  </UnstyledButton>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  variant='outline'
                  c="#c90000"
                  mr='lg'
                  leftSection={<IconLogout size={20} />}
                  onClick={logout}
                >
                  Sair
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main h='100vh'>
        <Stack justify="center" h='100%' gap={0}>
          <Text ta='center' size="lg">Olá, {session?.user.USER_NAME}</Text>
          <Text ta='center' c='dimmed'>Você não possue autorização</Text>
          <Text ta='center' c='dimmed'>Entre em contato com um administrador do sistema e solicite uma permissão.</Text>
          <Center>
            <Button
              component="a"
              href={whatsappUrl}
              target="_blank"
              type='Button'
              mt="md"
            >
              Solicitar permissão
            </Button>
          </Center>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
