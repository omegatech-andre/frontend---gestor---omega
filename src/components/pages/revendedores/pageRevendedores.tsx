import { Card, Group, Paper, Popover, RingProgress, SimpleGrid, Stack, Text } from "@mantine/core";
import { ResellerGetDetails } from "../../../types/resellerDetails";
import { IconBuildingStore, IconHandClick, IconMapPin } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ProviderTheme from "@/styles/providerTheme";
import ResellersList from "./resellerList";

type StateCounts = Record<string, number>;

interface Props {
  reseller: ResellerGetDetails[];
  totalResellers: number;
  activeResellers: number;
  pendingResellers: number;
  inactiveResellers: number;
  totalStates: number;
  activeStates: number;
  inactiveStates: number;
  stateCounts: StateCounts;
}

export default function PageRevendedores({
  reseller,
  totalResellers,
  activeResellers,
  pendingResellers,
  inactiveResellers,
  totalStates,
  activeStates,
  inactiveStates,
  stateCounts
}: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { close, open }] = useDisclosure(false);

  const totalStateCounts = Object.values(stateCounts).reduce((acc, count) => acc + count, 0);
  const sections = Object.entries(stateCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([_state, count], index) => {
      const value = (count / totalStateCounts) * 100;
      const colors = [
        '#FFD433', // Amarelo
        '#338AFF', // Azul céu
        '#FF5733', // Laranja queimado
        '#B833FF', // Roxo
        '#33FF66', // Verde primavera
        '#FF33FF', // Rosa choque
        '#33A8FF', // Azul celeste
        '#33FF99', // Verde limão
        '#A833FF', // Lilás
        '#33FFF7', // Ciano
        '#FF3333', // Vermelho sangue
        '#3357FF', // Azul royal
        '#FF33A8', // Rosa vivo
        '#33FF33', // Verde vivo
        '#FF8C33', // Laranja escuro
        '#3357FF', // Azul
        '#FF5733', // Terracota
      ];
      return { value, color: colors[index % colors.length] };
    });

  return (
    <>
      <Stack h='100%' align="center" >
        <Paper w='100%'>
          <Card withBorder p="md" radius="md">
            <Group m='auto' gap={isDesktop ? '30' : '10'} justify="center">
              <Popover width={200} position="bottom" withArrow shadow="md" opened={opened}>
                <Popover.Target>
                  <RingProgress
                    roundCaps
                    thickness={6}
                    size={150}
                    sections={sections}
                    label={
                      <Stack
                        onMouseEnter={open}
                        onMouseLeave={close}
                        style={{ cursor: 'pointer' }}
                        gap={0}
                      >
                        <Text ta="center" fz="lg" mt={15}>
                          {activeStates} Estados
                        </Text>
                        <Text ta="center" fz="xs" c="dimmed">
                          <IconHandClick size={20} />
                        </Text>
                      </Stack>
                    }
                  />
                </Popover.Target>
                <Popover.Dropdown w='max-content' style={{ pointerEvents: 'none' }} px={10}>
                  <Text fz='xs' c='dimmed' mb={10}>Estados com revendedores ativos:</Text>
                  <SimpleGrid cols={2} spacing={10}>
                    {Object.entries(stateCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([state, count]) => (
                        <Group key={state} justify="space-between" p={5} bg='#8a8a8a20' style={{ borderRadius: '3px' }}>
                          <Text size="xs">
                            {state}:
                          </Text>
                          <Text size="xs">
                            {count}
                          </Text>
                        </Group>
                      ))}
                  </SimpleGrid>
                </Popover.Dropdown>
              </Popover>
              <Stack gap={5}>
                <Text size="lg">
                  Resumo dos revendedores
                </Text>
                <Group>
                  <Stack gap={0}>
                    <Text fz="xs" c="dimmed" inline><IconBuildingStore size={23} /></Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{totalResellers}</Text>
                    <Text fz="xs" c="dimmed">Total</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{activeResellers}</Text>
                    <Text fz="xs" c="dimmed">Ativos</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{inactiveResellers}</Text>
                    <Text fz="xs" c="dimmed">Inativos</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{pendingResellers}</Text>
                    <Text fz="xs" c="dimmed">Pendentes</Text>
                  </Stack>
                </Group>
                <Group>
                  <Stack gap={0}>
                    <Text fz="xs" c="dimmed" inline><IconMapPin size={23} /></Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{totalStates}</Text>
                    <Text fz="xs" c="dimmed">Total</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{activeStates}</Text>
                    <Text fz="xs" c="dimmed">Ativos</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{inactiveStates}</Text>
                    <Text fz="xs" c="dimmed">Inativos</Text>
                  </Stack>
                </Group>
              </Stack>
            </Group>
          </Card>
        </Paper>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%'>
          <ResellersList resellers={reseller} />
        </Paper>
      </Stack>
    </>
  );
}
