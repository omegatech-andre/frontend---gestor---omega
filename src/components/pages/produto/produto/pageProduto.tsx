import { ActionIcon, Badge, Card, Flex, Group, Modal, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ProviderTheme from "@/styles/providerTheme";
import MenuNavigation from "@/components/_ui/menuNavigation/menuNavigation";
import { ProductGetDetails } from "@/types/productDetails";
import ProductDetail from "./productDetails";

interface Props {
  product: ProductGetDetails;
}

export default function PageProduto({ product }: Props) {
  const { isDesktop, isSmallDevice } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'status' | 'delete' | ''>('');

  const handleOpen = (content: 'status' | 'delete') => {
    setModalContent(content);
    open();
  };

  return (
    <>
      <Stack h='100%' align="center" >
        <MenuNavigation />
        <Card w='100%' shadow="sm" padding="sm" radius="md" withBorder>
          <Flex direction={isSmallDevice ? 'row' : 'column'} gap='xs'>
            <Text fz='h1' inline>{product.PRODUCT_NAME.toUpperCase()}</Text>
            <Group flex={1} justify="space-between">
              {
                product.PRODUCT_STATUS === 'APPROVED'
                  ? <Badge variant='default' c='green'>ativo</Badge>
                  : product.PRODUCT_STATUS === 'PENDING'
                    ? <Badge variant='default' c='yellow'>pendente</Badge>
                    : <Badge variant='default' c='dimmed'>desativ.</Badge>
              }
              <Group gap={5}>
                <Tooltip color="gray" label='Alterar status' position="bottom">
                  <ActionIcon onClick={() => handleOpen('status')} variant="filled" aria-label="Status">
                    <IconSettings size={20} />
                  </ActionIcon>
                </Tooltip>
                {/* <Tooltip color="gray" label='Deletar categoria' position="bottom">
                  <ActionIcon onClick={() => handleOpen('delete')} variant="filled" aria-label="Delete">
                    <IconTrash size={20} />
                  </ActionIcon>
                </Tooltip> */}
              </Group>
            </Group>
          </Flex>
        </Card>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%' >
          <ProductDetail product={product} />
        </Paper>
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
        {/* {modalContent === 'status' && <ModalPatchStatus category={category} />} */}
        {modalContent === 'status' && <>modal de editar status</>}
        {/* {modalContent === 'delete' && <ModalDeleteCategory category={category} />} */}
      </Modal>
    </>
  );
}
