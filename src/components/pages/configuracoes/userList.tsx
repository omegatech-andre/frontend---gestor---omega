import useGet from "@/hooks/useGet";
import ProviderTheme from "@/styles/providerTheme";
import { ActionIcon, Badge, Button, Center, Flex, Group, Menu, Modal, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconRefresh, IconSettings, IconUserShield } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FormatDate from "@/utils/formatDate";
import ModalPatchPermission from "./modals/modalPatchPermission";
import ModalPatchAdmin from "./modals/modalPatchAdmin";
import { UserGetDetails } from "@/types/userDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

export default function UsersList() {
  const { data: session } = useSession();
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<UserGetDetails | null>(null);
  const [modalContent, setModalContent] = useState<'permission' | 'admin' | null>(null);
  const [searchName, setsearchName] = useState<string>("");

  const { response, sendRequest } = useGet<UserGetDetails[]>(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });

  useEffect(() => {
    sendRequest();
  }, [])

  if (!response) return;

  const handleOpen = (user: UserGetDetails, content: 'permission' | 'admin') => {
    setSelectedUser(user);
    setModalContent(content);
    open();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsearchName(event.target.value);
  };

  const filteredUser = response.data.filter((data: UserGetDetails) => {
    const matchesSearchTerm = data.USER_NAME.toLowerCase().includes(searchName.toLowerCase());
    return matchesSearchTerm;
  });

  const rows = filteredUser?.map((row: UserGetDetails) => (
    <Table.Tr key={row.id}>
      <Table.Td>
        <Flex gap='xs' direction='column'>
          <Text fz="sm" inline>{row.USER_NAME}{row.USER_NAME === session?.user.USER_NAME && ' (eu)'}</Text>
          {row.USER_ROLE === 'ADMIN' ? (
            <Text display='flex' c='dimmed' fz='xs' hiddenFrom="md">Administrador {<IconUserShield size={15} style={{ marginLeft: '5px' }} />}</Text>
          ) : (
            <Text display='flex' c='dimmed' fz='xs' hiddenFrom="md">Usuário</Text>
          )}
        </Flex>
      </Table.Td>
      <Table.Td visibleFrom="md">{row.USER_ROLE === 'USER' ? 'Usuário' : 'Administrador'}</Table.Td>
      <Table.Td visibleFrom="md">{FormatDate(row.createdAt)}</Table.Td>
      <Table.Td>
        <Group fz="sm">{row.USER_AUTHORIZED ? <Badge variant='default' c="green" >Autorizado</Badge> : <Badge variant='default' c='dimmed'>Não autoriz.</Badge>}</Group>
      </Table.Td>
      <Table.Td >
        <Group gap={0} justify="flex-end" mr={10}>
          <Menu
            transitionProps={{ transition: 'pop' }}
            withArrow
            position="bottom-end"
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                disabled={row.USER_ROLE === session?.user.USER_ROLE}
                onClick={() => handleOpen(row, 'permission')}
                leftSection={
                  <IconSettings size={20} />
                }
              >
                Editar permissão
              </Menu.Item>
              <Menu.Item
                disabled={row.USER_ROLE === 'ADMIN'}
                onClick={() => handleOpen(row, 'admin')}
                leftSection={
                  <IconUserShield size={20} />
                }
              >
                Dar Administrador
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack mb={isDesktop ? '0' : '80'}>
        <Stack>
          <Text>
            numero de usuarios: {response.data.length}
          </Text>
          <Group w='100%' justify="space-between" >
            <TextInput
              w='auto'
              type="search"
              placeholder="Buscar pelo nome"
              style={{ flexGrow: 1 }}
              value={searchName}
              onChange={handleSearchChange}
            />
            <Button onClick={() => window.location.reload()}>
              <IconRefresh size={20} />
              <Center visibleFrom="md" ml={5}>Recarregar</Center>
            </Button>
          </Group>
        </Stack>
        <Stack align='center' justify='center'>
          <Paper w='100%' withBorder radius='md' style={{ overflow: 'hidden' }}>
            <Table.ScrollContainer minWidth={300} h='auto' mah='40vh' type='native' >
              <Table verticalSpacing="xs" striped highlightOnHover withRowBorders={false}>
                <Table.Thead pos='sticky' style={{ backdropFilter: `blur(100px)` }}>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th visibleFrom="md">Função</Table.Th>
                    <Table.Th visibleFrom="md">Criação</Table.Th>
                    <Table.Th>Permissão</Table.Th>
                    <Table.Th ta='end' />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Stack>
      </Stack>
      {selectedUser !== null && modalContent !== null && (
        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}
        >
          {modalContent === 'permission' && <ModalPatchPermission user={selectedUser} />}
          {modalContent === 'admin' && <ModalPatchAdmin user={selectedUser} />}
        </Modal>
      )}
    </>
  );
}
