import { useEffect, useState } from "react";
import { ActionIcon, Modal, Paper, SimpleGrid, Text, TextInput, Button, Group, Stack, Textarea } from "@mantine/core";
import { IconCheck, IconCircleCheckFilled, IconEdit, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { LineGetDetails } from "@/types/lineDetails";
import ProviderTheme from "@/styles/providerTheme";

interface Props {
  line: LineGetDetails;
}

export default function LineDetail({ line }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputLabel, setInputLabel] = useState<string>("");

  const handleOpenModal = (label: string, field: string, value: string) => {
    setCurrentField(field);
    setInputValue(value);
    setInputLabel(label);
    open();
  };

  const renderTextInput = (label: string, value: string, field: string) => (
    <TextInput
      description={label}
      value={value}
      readOnly
      rightSection={
        <ActionIcon onClick={() => handleOpenModal(label, field, value)} variant="transparent" c="dimmed" aria-label={label}>
          <IconEdit size={20} />
        </ActionIcon>
      }
    />
  );

  return (
    <>
      <Paper px={isDesktop ? '20' : '0'}>
        <SimpleGrid mt={10} mb={isDesktop ? '0' : '80'} cols={{ base: 1 }} spacing={20} verticalSpacing={15}>
          {renderTextInput("Nome", line.LINE_NAME, "LINE_NAME")}
          {renderTextInput("Descrição", line.LINE_DESCRIPTION, "LINE_DESCRIPTION")}
        </SimpleGrid>
      </Paper>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <>modal de patch details</>
      </Modal>
    </>
  );
}
