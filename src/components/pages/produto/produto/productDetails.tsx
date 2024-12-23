import { useState } from "react";
import { ActionIcon, Card, Flex, Modal, Paper, SimpleGrid, Text, TextInput } from "@mantine/core";
import { IconCircleCheck, IconCircleX, IconDownload, IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ProviderTheme from "@/styles/providerTheme";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";
import ModalPatchDetails from "./modals/modalPatchDetails";
import ModalPatchColors from "./modals/modalPatchColors";

interface Props {
  product: ProductGetDetails;
}

export default function ProductDetail({ product }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'default' | 'colors' | 'boletim' | ''>('');
  const [currentField, setCurrentField] = useState<keyof ProductPostDetails>("PRODUCT_NAME");
  const [inputValue, setInputValue] = useState<string | string[] | { COLOR_NAME: string; COLOR_HEX: string }[]>("");
  const [inputLabel, setInputLabel] = useState<string>("");

  const handleOpenModal = (contet: 'default' | 'colors' | 'boletim', label: string, value: string | string[] | { COLOR_NAME: string; COLOR_HEX: string }[], field: keyof ProductPostDetails) => {
    setModalContent(contet)
    setInputLabel(label);
    setInputValue(value);
    setCurrentField(field);
    open();
  };

  const renderTextInput = (label: string, value: string | string[], field: keyof ProductPostDetails) => (
    <TextInput
      description={label}
      value={Array.isArray(value) ? value.join(", ") : value.split(",").join(", ")}
      readOnly
      rightSection={
        <ActionIcon onClick={() => handleOpenModal('default', label, value, field)} variant="transparent" c="dimmed" aria-label={label}>
          <IconEdit size={20} />
        </ActionIcon>
      }
    />
  );

  return (
    <>
      <Paper px={isDesktop ? '20' : '0'}>
        <SimpleGrid mt={10} mb={isDesktop ? '0' : '80'} cols={{ base: 1 }} spacing={20} verticalSpacing={15}>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {renderTextInput("Nome", product.PRODUCT_NAME, "PRODUCT_NAME")}
            {renderTextInput("Categoria", product.PRODUCT_CATEGORY.CATEGORY_NAME, "FK_PRODUCT_CATEGORY")}
          </SimpleGrid>
          {renderTextInput("Descrição", product.PRODUCT_DESCRIPTION, "PRODUCT_DESCRIPTION")}
          {renderTextInput("Tags", product.PRODUCT_TAGS, "PRODUCT_TAGS")}
          {renderTextInput("Tamanhos", product.PRODUCT_SIZES, "PRODUCT_SIZES")}
          <TextInput
            description="Cores"
            value={product.PRODUCT_COLORS.map(cor => cor.COLOR_NAME).join(", ")}
            readOnly
            rightSection={
              <ActionIcon onClick={() => handleOpenModal("colors", "Cores", product.PRODUCT_COLORS, "PRODUCT_COLORS")} variant="transparent" c="dimmed" aria-label={"Cores"}>
                <IconEdit size={20} />
              </ActionIcon>
            }
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Flex direction={"column"}>
              <Text fz={"xs"} c={"dimmed"}>Boletim Técnico</Text>
              <Card withBorder p={4}>
                <Flex justify={"space-between"}>
                  <Flex align={"center"}>
                    {
                      product.PRODUCT_BOLETIM.length >= 0
                        ? <IconCircleX color="red" size={20} />
                        : <IconCircleCheck color="green" size={20} />
                    }
                    <Text px={6} fz={"sm"}>{product.PRODUCT_BOLETIM.length >= 0 ? "Sem boletim" : "com"}</Text>
                  </Flex>
                  <Flex>
                    <ActionIcon disabled={product.PRODUCT_BOLETIM.length === 0} onClick={() => console.log("baixar pdf")} variant="transparent" c="dimmed" aria-label={"Cores"}>
                      <IconDownload size={20} />
                    </ActionIcon>
                    <ActionIcon onClick={() => handleOpenModal("boletim", "Boletim técnico", product.PRODUCT_BOLETIM, "PRODUCT_BOLETIM")} variant="transparent" c="dimmed" aria-label={"Boletim Técnico"}>
                      <IconEdit size={20} />
                    </ActionIcon>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          </SimpleGrid>
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
        {modalContent === 'default' && <ModalPatchDetails product={product} inputLabel={inputLabel} inputValue={inputValue} inputField={currentField} />}
        {modalContent === 'colors' && <ModalPatchColors product={product} inputLabel={inputLabel} inputValue={inputValue} inputField={currentField} />}
        {modalContent === 'boletim' && <>edit boletim</>}
      </Modal>
    </>
  );
}
