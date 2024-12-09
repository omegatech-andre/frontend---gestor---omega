import { ActionIcon, Badge, Button, Card, Center, Flex, Group, Menu, Modal, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { IconDots, IconListDetails, IconRefresh, IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { LineGetDetails } from "@/types/lineDetails";
import ProviderTheme from "@/styles/providerTheme";
import ModalPatchStatus from "../produto/linha/modals/modalPatchStatus";

interface Props {
  lines: LineGetDetails[];
}

export default function LineList({ lines }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedLine, setSelectedLine] = useState<LineGetDetails>();
  const [modalContent, setModalContent] = useState<'edit' | 'delete' | ''>('');

  const handleOpen = (content: 'edit' | 'delete', line: LineGetDetails) => {
    setModalContent(content)
    setSelectedLine(line);
    open();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const filteredLines = lines?.filter((line: LineGetDetails) => {
    const matchesSearchTerm = line.LINE_NAME.toLowerCase().includes(searchName.toLowerCase());
    return matchesSearchTerm;
  });

  const rows = filteredLines?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Flex gap='xs' direction='column'>
          <Text fz="sm" inline pl='3px'>
            {
              row.LINE_NAME
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")
            }
          </Text>
          <Group hiddenFrom="md" fz="xs">
            {
              row.LINE_STATUS === 'APPROVED'
                ? <Badge variant='default' c="green">ativo</Badge>
                : row.LINE_STATUS === 'PENDING'
                  ? <Badge variant='default' c='yellow'>pendente</Badge>
                  : <Badge variant='default' c='dimmed'>desativ.</Badge>
            }
          </Group>
        </Flex>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Text truncate='end' fz='sm' w={200}>{row.LINE_DESCRIPTION}</Text>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Group fz="sm">
          {
            row.LINE_STATUS === 'APPROVED'
              ? <Badge variant='default' c="green">ativo</Badge>
              : row.LINE_STATUS === 'PENDING'
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
              <Menu.Item component='a' href={`/linha/${row.LINE_NAME}`} leftSection={<IconListDetails size={20} />}>Detalhes</Menu.Item>
              <Menu.Item onClick={() => handleOpen('edit', row)} leftSection={<IconSettings size={20} />}>Alterar Status</Menu.Item>
              {/* <Menu.Item onClick={() => handleOpen('delete', row)} leftSection={<IconTrash size={20} />}>Deletar linha</Menu.Item> */}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack mb={isDesktop ? '0' : '80'}>
      <Flex gap={15}>
        <TextInput
          w='auto'
          type="search"
          placeholder="Buscar pelo nome da linha"
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
        {lines.length <= 0 ? (
          <Card w='100%' h='20vh' ta='center'>
            <Text m='auto' c='dimmed'>Nada aqui ainda.</Text>
          </Card>
        ) : (
          <Paper w='100%' withBorder radius='md' style={{ overflow: 'hidden' }}>
            <Table.ScrollContainer minWidth={300} h='auto' mah='50vh' type='native' >
              <Table verticalSpacing="sm" striped highlightOnHover withRowBorders={false}>
                <Table.Thead pos='sticky' style={{ backdropFilter: `blur(100px)` }} >
                  <Table.Tr>
                    <Table.Th>Nome da linha</Table.Th>
                    <Table.Th visibleFrom="md">Descrição</Table.Th>
                    <Table.Th visibleFrom="md">Status</Table.Th>
                    <Table.Th ta='end' />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        )}
        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}
        >
          {modalContent === 'edit' && <ModalPatchStatus line={selectedLine} />}
          {/* {modalContent === 'delete' && <ModalDeleteLine line={selectedLine} />} */}
        </Modal>
      </Stack>
    </Stack>
  );
}
