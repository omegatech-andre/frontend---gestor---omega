import { useState } from "react";
import { ActionIcon, Modal, Paper, SimpleGrid, TextInput } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ResellerGetDetails, ResellerPostDetails } from "@/types/resellerDetails";
import ProviderTheme from "@/styles/providerTheme";
import ModalPatchDetails from "./modals/modalPatchDetails";

interface Props {
  reseller: ResellerGetDetails;
}

export default function ResellerDetail({ reseller }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [currentField, setCurrentField] = useState<keyof ResellerPostDetails>("RESELLER_CNPJ");
  const [inputValue, setInputValue] = useState<string>("");
  const [inputLabel, setInputLabel] = useState<string>("");

  const handleOpenModal = (label: string, value: string, field: keyof ResellerPostDetails) => {
    setInputLabel(label);
    setInputValue(value);
    setCurrentField(field);
    open();
  };

  const renderTextInput = (label: string, value: string, field: keyof ResellerPostDetails) => (
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
        <SimpleGrid mt={10} mb={isDesktop ? '0' : '80'} cols={{ base: 1, lg: 2 }} spacing={20} verticalSpacing={15}>
          {renderTextInput("Razão Social", reseller.RESELLER_SOCIAL_NAME, "RESELLER_SOCIAL_NAME")}
          {renderTextInput("CNPJ", reseller.RESELLER_CNPJ, "RESELLER_CNPJ")}
          {renderTextInput("Nome Fantasia", reseller.RESELLER_FANTASY_NAME, "RESELLER_FANTASY_NAME")}
          {renderTextInput("Email", reseller.RESELLER_EMAIL, "RESELLER_EMAIL")}
          {renderTextInput("Telefone principal", reseller.RESELLER_PHONE1, "RESELLER_PHONE1")}
          {renderTextInput("Telefone secundário", reseller.RESELLER_PHONE2, "RESELLER_PHONE2")}
          {renderTextInput("CEP", reseller.RESELLER_ZIP_CODE, "RESELLER_ZIP_CODE")}
          {renderTextInput("UF", reseller.RESELLER_STATE, "RESELLER_STATE")}
          {renderTextInput("Cidade", reseller.RESELLER_CITY, "RESELLER_CITY")}
          {renderTextInput("Bairro", reseller.RESELLER_DISTRICT, "RESELLER_DISTRICT")}
          {renderTextInput("Rua", reseller.RESELLER_STREET, "RESELLER_STREET")}
          {renderTextInput("Número", reseller.RESELLER_NUMBER, "RESELLER_NUMBER")}
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
        <ModalPatchDetails reseller={reseller} inputLabel={inputLabel} inputValue={inputValue} inputField={currentField} />
      </Modal>
    </>
  );
}
