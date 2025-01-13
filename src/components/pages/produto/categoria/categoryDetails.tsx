import { useState } from "react";
import { ActionIcon, Modal, Paper, SimpleGrid, TextInput } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CategoryGetDetails, CategoryPostDetails } from "@/types/categoryDetails";
import ProviderTheme from "@/styles/providerTheme";
import ModalPatchDetails from "./modals/modalPatchDetails";

interface Props {
  category: CategoryGetDetails;
}

export default function CategoryDetail({ category }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [currentField, setCurrentField] = useState<keyof CategoryPostDetails>("CATEGORY_NAME");
  const [inputValue, setInputValue] = useState<string>("");
  const [inputLabel, setInputLabel] = useState<string>("");

  const handleOpenModal = (label: string, value: string, field: keyof CategoryPostDetails) => {
    setInputLabel(label);
    setInputValue(value);
    setCurrentField(field);
    open();
  };

  const renderTextInput = (label: string, value: string, field: keyof CategoryPostDetails) => (
    <TextInput
      description={label}
      value={value}
      readOnly
      rightSection={
        <ActionIcon onClick={() => handleOpenModal(label, value, field)} variant="transparent" c="dimmed" aria-label={label}>
          <IconEdit size={20} />
        </ActionIcon>
      }
    />
  );

  return (
    <>
      <Paper px={isDesktop ? '20' : '0'}>
        <SimpleGrid mt={10} mb={isDesktop ? '0' : '80'} cols={{ base: 1 }} spacing={20} verticalSpacing={15}>
          {renderTextInput("Nome", category.CATEGORY_NAME, "CATEGORY_NAME")}
          {renderTextInput("Descrição", category.CATEGORY_DESCRIPTION, "CATEGORY_DESCRIPTION")}
          {renderTextInput("Linha", category.CATEGORY_LINE.LINE_NAME, "FK_CATEGORY_LINE")}
        </SimpleGrid>
      </Paper>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        closeOnClickOutside={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <ModalPatchDetails category={category} inputLabel={inputLabel} inputValue={inputValue} inputField={currentField} />
      </Modal>
    </>
  );
}
