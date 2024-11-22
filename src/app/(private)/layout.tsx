'use client';
import { AppShell, Burger, Button, Group, Image, Menu, Stack, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import classes from './layout.module.css';
import { signOut, useSession } from 'next-auth/react';
import { IconBuildingStore, IconLogout, IconPackage, IconSettings } from '@tabler/icons-react';
import Loading from '../loading';
import { redirect } from 'next/navigation';
import ProviderAvatar from '@/components/_ui/avatar/providerAvatar';
import AccessDenied from '@/components/pages/accessDenied/accessDenied';

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  if (status === 'loading') return <Loading />;

  if (!session) redirect('/');

  const logout = async () => {
    await signOut({ redirect: false });
    redirect('/');
  }

  return (
    <>
      {!session?.user.USER_AUTHORIZED ? (
        <AccessDenied />
      ) : (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Group>
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                <Image src="/logo_0.webp" w={40} />
              </Group>
              <Group>
                <Menu>
                  <Menu.Target>
                    <Group>
                      <Text c="dimmed" size="sm" inline>
                        Olá, {session?.user.USER_NAME}
                      </Text>
                      <UnstyledButton>
                        <ProviderAvatar name={session.user.USER_NAME || ''} size='2.3rem' />
                      </UnstyledButton>
                    </Group>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      variant="outline"
                      c="#c90000"
                      mr="lg"
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
          <AppShell.Navbar p="md">
            <Stack gap={5}>
              <Link href="/produtos" passHref style={{ textDecoration: 'none' }}>
                <Button
                  onClick={toggleMobile}
                  className={classes.navbutton}
                  variant="default"
                  justify="flex-start"
                  fullWidth
                  leftSection={<IconPackage size={20} />}
                >
                  Produtos
                </Button>
              </Link>
              <Link href="/revendedores" passHref style={{ textDecoration: 'none' }}>
                <Button
                  onClick={toggleMobile}
                  className={classes.navbutton}
                  variant="default"
                  justify="flex-start"
                  fullWidth
                  leftSection={<IconBuildingStore size={20} />}
                >
                  Revendedores
                </Button>
              </Link>
              {session?.user.USER_ROLE === 'ADMIN' && (
                <Link href="/configuracoes" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    onClick={toggleMobile}
                    className={classes.navbutton}
                    variant="default"
                    justify="flex-start"
                    fullWidth
                    leftSection={<IconSettings size={20} />}
                  >
                    Configurações
                  </Button>
                </Link>
              )}
            </Stack>
            <Group mt="auto">
              <Button
                leftSection={<IconLogout size={20} />}
                fullWidth
                variant="default"
                c="#c90000"
                color="#c90000"
                onClick={logout}
              >
                Sair
              </Button>
            </Group>
          </AppShell.Navbar>
          <AppShell.Main w="100vw" h="max-content">
            {children}
          </AppShell.Main>
        </AppShell>
      )}
    </>
  );
}
