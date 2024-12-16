import { ActionIcon, Affix, Menu, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBox, IconBuildingStore, IconCubePlus, IconPackage, IconPlus, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import ModalPostUser from "./modals/modalPostUser";
import ModalPostReseller from "./modals/modalPostReseller";
import ModalPostLine from "./modals/modalPostLine";
import ModalPostCategory from "./modals/modalPostCategory";
import ModalPostProduct from "./modals/modalPostProduct";

export default function FloatButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'product' | 'line' | 'category' | 'reseller' | 'user' | ''>('');

  const handleOpen = (content: 'product' | 'line' | 'category' | 'reseller' | 'user') => {
    setModalContent(content);
    open();
  };

  return (
    <>
      <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
        <Menu.Target>
          <Affix position={{ bottom: 25, right: 25 }} zIndex={100}>
            <Tooltip label="Adicionar" position="left">
              <ActionIcon size="3rem" radius='xl'>
                <IconPlus size={30} />
              </ActionIcon>
            </Tooltip>
          </Affix >
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Adicionar:</Menu.Label>
          <Menu.Item onClick={() => handleOpen('line')} leftSection={<IconCubePlus size={20} />}>Linha</Menu.Item>
          <Menu.Item onClick={() => handleOpen('category')} leftSection={<IconBox size={20} />}>Categoria</Menu.Item>
          <Menu.Item onClick={() => handleOpen('product')} leftSection={<IconPackage size={20} />}>Produto</Menu.Item>
          <Menu.Item onClick={() => handleOpen('reseller')} leftSection={<IconBuildingStore size={20} />}>Revendedor</Menu.Item>
          <Menu.Item onClick={() => handleOpen('user')} leftSection={<IconUser size={20} />}>Usuário</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        size='auto'
        opened={opened}
        onClose={close}
        withCloseButton
        title={
          modalContent === 'line'
            ? 'Criar linha'
            : modalContent === 'category'
              ? 'Criar categoria'
              : modalContent === 'product'
                ? 'Criar produto'
                : modalContent === 'reseller'
                  ? 'Criar revendedor'
                  : 'Criar usuário'
        }
        closeOnClickOutside={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        {modalContent === 'line' && <ModalPostLine />}
        {modalContent === 'category' && <ModalPostCategory />}
        {modalContent === 'product' && <ModalPostProduct />}
        {modalContent === 'reseller' && <ModalPostReseller />}
        {modalContent === 'user' && <ModalPostUser />}
      </Modal>
    </>
  );
}
