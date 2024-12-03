import React, { useState } from 'react';
import { ActionIcon, Avatar, Badge, Button, Card, Center, Checkbox, Flex, Group, Menu, Modal, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { IconDots, IconFilter, IconListDetails, IconRefresh, IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ResellerGetDetails } from '@/types/resellerDetails';
import ProviderTheme from '@/styles/providerTheme';
import { FormatePhone } from '@/utils/formatPhone';
import ModalPatchStatus from '../revendedor/modals/modalPatchStatus';

interface Props {
  data: ResellerGetDetails[]
}

export default function ResellersList({ data }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedReseller, setSelectedReseller] = useState<ResellerGetDetails>();
  const [searchName, setSearchName] = useState<string>("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const states = Array.from(new Set(data.map(reseller => reseller.RESELLER_STATE)));

  const handleOpen = (reseller: ResellerGetDetails) => {
    setSelectedReseller(reseller);
    open();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleStateToggle = (state: string) => {
    setSelectedStates(prevStates =>
      prevStates.includes(state)
        ? prevStates.filter(s => s !== state)
        : [...prevStates, state]
    );
  };

  const filteredReseller = data?.filter((reseller: ResellerGetDetails) => {
    const matchesSearchTerm = reseller.RESELLER_FANTASY_NAME.toLowerCase().includes(searchName.toLowerCase());
    const matchesState = selectedStates.length === 0 || selectedStates.includes(reseller.RESELLER_STATE);
    return matchesSearchTerm && matchesState;
  });

  const rows = filteredReseller?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Flex gap="sm" align='center'>
          <Avatar size={35} src={`${process.env.NEXT_PUBLIC_BASE_URL}${row.RESELLER_URL_LOGO}`} />
          <Flex gap='xs' direction='column'>
            <Text fz="sm" inline pl='3px'>{row.RESELLER_FANTASY_NAME}</Text>
            <Group hiddenFrom="md" fz="xs">
              {
                row.RESELLER_STATUS === 'APPROVED'
                  ? <Badge variant='default' c='green'>ativo</Badge>
                  : row.RESELLER_STATUS === 'PENDING'
                    ? <Badge variant='default' c='yellow'>pendente</Badge>
                    : <Badge variant='default' c='dimmed'>desativ.</Badge>
              }
            </Group>
          </Flex>
        </Flex>
      </Table.Td>
      <Table.Td visibleFrom="md">{row.RESELLER_STATE}</Table.Td>
      <Table.Td visibleFrom="md">{FormatePhone(row.RESELLER_PHONE1)}</Table.Td>
      <Table.Td visibleFrom="md">
        <Group fz="sm">
          {
            row.RESELLER_STATUS === 'APPROVED'
              ? <Badge variant='default' c='green'>ativo</Badge>
              : row.RESELLER_STATUS === 'PENDING'
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
              <Menu.Item component='a' href={`/revendedor/${row.RESELLER_FANTASY_NAME}`} leftSection={<IconListDetails size={20} />}>Detalhes</Menu.Item>
              <Menu.Item onClick={() => handleOpen(row)} leftSection={<IconSettings size={20} />}>Alterar Status</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr >
  ));

  return (
    <>
      <Stack mb={isDesktop ? '0' : '80'}>
        <Flex gap={15}>
          <TextInput
            w='auto'
            type="search"
            placeholder="Buscar pelo nome"
            style={{ flexGrow: 1 }}
            value={searchName}
            onChange={handleSearchChange}
          />
          <Flex gap={15}>
            <Menu trigger="click-hover" shadow="md">
              <Menu.Target>
                <Button>
                  <IconFilter size={20} />
                  <Center visibleFrom="md">Filtro</Center>
                </Button>
              </Menu.Target>
              <Menu.Dropdown style={{ maxHeight: 200, overflowY: 'auto' }}>
                <Menu.Label>Filtrar por:</Menu.Label>
                {states.map(state => (
                  <Group key={state} align="center" style={{ padding: '5px 10px' }}>
                    <Checkbox
                      checked={selectedStates.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      label={state}
                    />
                  </Group>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Button onClick={() => console.log('nada')}>
              <IconRefresh size={20} />
              <Center visibleFrom="md">Recarregar</Center>
            </Button>
          </Flex>
        </Flex>
        <Stack align='center' justify='center'>
          {filteredReseller.length <= 0 ? (
            <Card w='100%' h='20vh' ta='center'>
              <Text m='auto' c='dimmed'>Nada aqui ainda.</Text>
            </Card>
          ) : (
            <Paper w='100%' withBorder radius='md' style={{ overflow: 'hidden' }}>
              <Table.ScrollContainer minWidth={300} h='auto' mah='50vh' type='native' >
                <Table verticalSpacing="sm" striped highlightOnHover withRowBorders={false}>
                  <Table.Thead pos='sticky' style={{ backdropFilter: `blur(100px)` }} >
                    <Table.Tr>
                      <Table.Th>Revendedor</Table.Th>
                      <Table.Th visibleFrom="md">Estado</Table.Th>
                      <Table.Th visibleFrom="md">Telefone</Table.Th>
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
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
      >
        <ModalPatchStatus reseller={selectedReseller} />
      </Modal>
    </>
  );
}
