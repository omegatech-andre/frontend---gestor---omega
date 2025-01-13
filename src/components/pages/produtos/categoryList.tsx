import { ActionIcon, Badge, Button, Card, Center, Flex, Group, Menu, Modal, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { IconDots, IconListDetails, IconRefresh, IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { CategoryGetDetails } from "@/types/categoryDetails";
import ProviderTheme from "@/styles/providerTheme";
import ModalPatchStatus from "../produto/categoria/modals/modalPatchStatus";
import { useSession } from "next-auth/react";

interface Props {
  categories: CategoryGetDetails[];
}

export default function CategoryList({ categories }: Props) {
  const { data: session } = useSession();
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryGetDetails>();
  const [modalContent, setModalContent] = useState<'edit' | 'delete' | ''>('');

  const handleOpen = (content: 'edit' | 'delete', category: CategoryGetDetails) => {
    setModalContent(content)
    setSelectedCategory(category);
    open();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const filteredCategories = categories?.filter((category: CategoryGetDetails) => {
    const matchesSearchTerm = category.CATEGORY_NAME.toLowerCase().includes(searchName.toLowerCase());
    return matchesSearchTerm;
  });

  const rows = filteredCategories?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Flex gap='xs' direction='column'>
          <Text fz="sm" inline pl='3px'>
            {
              row.CATEGORY_NAME
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")
            }
          </Text>
          <Group hiddenFrom="md" fz="xs">
            {
              row.CATEGORY_STATUS === 'APPROVED'
                ? <Badge variant='default' c="green">ativo</Badge>
                : row.CATEGORY_STATUS === 'PENDING'
                  ? <Badge variant='default' c='yellow'>pendente</Badge>
                  : <Badge variant='default' c='dimmed'>desativ.</Badge>
            }
            <Text fz='xs' c='dimmed'>{row.CATEGORY_LINE.LINE_NAME}</Text>
          </Group>
        </Flex>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Text truncate='end' fz='sm' w={200}>{row.CATEGORY_DESCRIPTION}</Text>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Text fz='sm'>{row.CATEGORY_LINE.LINE_NAME}</Text>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Group fz="sm">
          {
            row.CATEGORY_STATUS === 'APPROVED'
              ? <Badge variant='default' c="green">ativo</Badge>
              : row.CATEGORY_STATUS === 'PENDING'
                ? <Badge variant='default' c='yellow'>pendente</Badge>
                : <Badge variant='default' c='dimmed'>desativ.</Badge>
          }
        </Group>
      </Table.Td>
      <Table.Td >
        <Group gap={0} justify="flex-end" mr={10}>
          <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component='a' href={`/categoria/${row.CATEGORY_NAME}`} leftSection={<IconListDetails size={20} />}>Detalhes</Menu.Item>
              <Menu.Item disabled={session?.user.USER_ROLE === "USER"} onClick={() => handleOpen('edit', row)} leftSection={<IconSettings size={20} />}>Alterar Status</Menu.Item>
              {/* <Menu.Item onClick={() => handleOpen('delete', row)} leftSection={<IconTrash size={20} />}>Deletar categoria</Menu.Item> */}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack mb={isDesktop ? '0' : '80'}>
        <Flex gap={15}>
          <TextInput
            w='auto'
            type="search"
            placeholder="Buscar pelo nome da categoria"
            style={{ flexGrow: 1 }}
            value={searchName}
            onChange={handleSearchChange}
          />
          <Button onClick={() => window.location.reload()}>
            <IconRefresh size={20} />
            <Center visibleFrom="md">Recarregar</Center>
          </Button>
        </Flex>
        <Stack align='center' justify='center'>
          {categories.length <= 0 ? (
            <Card w='100%' h='20vh' ta='center'>
              <Text m='auto' c='dimmed'>Nada aqui ainda.</Text>
            </Card>
          ) : (
            <Paper w='100%' withBorder radius='md' style={{ overflow: 'hidden' }}>
              <Table.ScrollContainer minWidth={300} h='auto' mah='50vh' type='native' >
                <Table verticalSpacing="sm" striped highlightOnHover withRowBorders={false}>
                  <Table.Thead pos='sticky' style={{ backdropFilter: `blur(100px)` }} >
                    <Table.Tr>
                      <Table.Th>Nome da categoria</Table.Th>
                      <Table.Th visibleFrom="md">Descrição</Table.Th>
                      <Table.Th visibleFrom="md">Linha</Table.Th>
                      <Table.Th visibleFrom="md">Status</Table.Th>
                      <Table.Th ta='end' />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>
          )}
        </Stack>
        <Text size="xs" c='dimmed' mt={10}>OBS: Uma categoria desativada fica oculta no site oficial, por consequência os produtos dessa categoria tambem não serão mostrados.</Text>
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        closeOnClickOutside={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
      >
        {modalContent === 'edit' && <ModalPatchStatus category={selectedCategory} />}
        {/* {modalContent === 'delete' && <ModalDeleteCategory category={selectedCategory} />} */}
      </Modal>
    </>
  );
}
