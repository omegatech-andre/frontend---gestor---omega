import { ActionIcon, Avatar, BackgroundImage, Badge, Group, Modal, Paper, Stack, Text, Tooltip } from "@mantine/core"
import { IconPhoto, IconSettings } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { ResellerGetDetails } from "@/types/resellerDetails";
import ProviderTheme from "@/styles/providerTheme";
import { useState } from "react";
import MenuNavigation from "@/components/_ui/menuNavigation/menuNavigation";

interface Props {
  reseller: ResellerGetDetails;
}

export default function PageRevendedor({ reseller }: Props) {
  const { isDesktop } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'picture' | 'status' | ''>('');

  const handleOpen = (content: 'picture' | 'status') => {
    setModalContent(content);
    open();
  };

  return (
    <>
      <Stack h='100%' align="center" >
        <MenuNavigation />
        <BackgroundImage src="/tumblr_0.webp" ta='center' p='20' radius={10} style={{
          backgroundPosition: 'right'
        }}>
          <Paper m='auto' w='max-content' radius={100} p={5} withBorder>
            <Avatar size={120} src={`${process.env.NEXT_PUBLIC_BASE_URL}${reseller.RESELLER_URL_LOGO}`} />
          </Paper>
          <Text my={5} size='lg'>{reseller.RESELLER_FANTASY_NAME.toUpperCase()}</Text>
          <Group mb={10} justify="center">
            {
              reseller.RESELLER_STATUS === 'APPROVED'
                ? <Badge variant='default' c="green">ativo</Badge>
                : reseller.RESELLER_STATUS === 'PENDING'
                  ? <Badge variant='default' c='yellow'>pendente</Badge>
                  : <Badge variant='default' c='dimmed'>desativ.</Badge>
            }
          </Group>
          <Group justify="center" gap={5}>
            <Tooltip color="gray" label='Aterar logo' position="bottom">
              <ActionIcon onClick={() => handleOpen('picture')} variant="filled" aria-label="Picture">
                <IconPhoto size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip color="gray" label='Alterar status' position="bottom">
              <ActionIcon onClick={() => handleOpen('status')} variant="filled" aria-label="Status">
                <IconSettings size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </BackgroundImage>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%' >
          {/* <ResellerDetail reseller={reseller} /> */}
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
        {modalContent === 'picture' && <>modal de picture</>}
        {modalContent === 'status' && <>modal de status</>}
        {/* {modalContent === 'picture' && <ModalEditResellerLogo reseller={reseller} />} */}
        {/* {modalContent === 'status' && <ModalEditResellerStatus reseller={reseller} />} */}
      </Modal>
    </>
  );
}
