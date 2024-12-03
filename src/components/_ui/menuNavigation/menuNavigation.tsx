import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function MenuNavigation() {
  const router = useRouter();
  const backspace = () => router.back();
  const refresh = () => window.location.reload();

  return (
    <Group w='100%' gap={5} justify="flex-start">
      <Tooltip color="gray" label='Voltar' position="bottom">
        <ActionIcon onClick={backspace} variant="filled" aria-label="Voltar">
          <IconArrowLeft size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip color="gray" label='Recarregar' position="bottom">
        <ActionIcon onClick={refresh} variant="filled" aria-label="Recarregar">
          <IconRefresh size={20} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
