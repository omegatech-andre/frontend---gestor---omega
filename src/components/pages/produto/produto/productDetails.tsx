import { useState } from "react";
import { ActionIcon, Modal, Paper, SimpleGrid, TextInput } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ProviderTheme from "@/styles/providerTheme";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";

interface Props {
  product: ProductGetDetails;
}

export default function ProductDetail({ product }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [currentField, setCurrentField] = useState<keyof ProductPostDetails>("PRODUCT_NAME");
  const [inputValue, setInputValue] = useState<string | string[]>("");
  const [inputLabel, setInputLabel] = useState<string>("");

  const handleOpenModal = (label: string, value: string | string[], field: keyof ProductPostDetails) => {
    setInputLabel(label);
    setInputValue(value);
    setCurrentField(field);
    open();
  };

  const renderTextInput = (label: string, value: string | string[], field: keyof ProductPostDetails) => (
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
          {renderTextInput("Nome", product.PRODUCT_NAME, "PRODUCT_NAME")}
          {renderTextInput("Descrição", product.PRODUCT_DESCRIPTION, "PRODUCT_DESCRIPTION")}
          {renderTextInput("Categoria", product.PRODUCT_CATEGORY.CATEGORY_NAME, "FK_PRODUCT_CATEGORY")}
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
        <>modal de editar</>
        {/* <ModalPatchDetails category={category} inputLabel={inputLabel} inputValue={inputValue} inputField={currentField} /> */}
      </Modal>
    </>
  );
}
