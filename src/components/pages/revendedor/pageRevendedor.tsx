import { ActionIcon, Avatar, BackgroundImage, Badge, Group, Modal, Paper, Stack, Text, Tooltip } from "@mantine/core"
import { IconPhoto, IconSettings } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { ResellerGetDetails } from "@/types/resellerDetails";
import ProviderTheme from "@/styles/providerTheme";
import { useState } from "react";
import MenuNavigation from "@/components/_ui/menuNavigation/menuNavigation";
import ModalPatchStatus from "./modals/modalPatchStatus";
import ModalPatchLogo from "./modals/modalPatchLogo";
import ResellerDetail from "./resellerDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { useSession } from "next-auth/react";

interface Props {
  reseller: ResellerGetDetails;
}

export default function PageRevendedor({ reseller }: Props) {
  const { data: session } = useSession();
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
            <Avatar size={120} src={`${API_BASE_URL}${reseller.RESELLER_URL_LOGO}`} />
          </Paper>
          <Text my={5} size='lg'>
            {
              reseller.RESELLER_FANTASY_NAME
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            }
          </Text>
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
              <ActionIcon disabled={session?.user.USER_ROLE === "USER"} onClick={() => handleOpen('picture')} variant="filled" aria-label="Picture">
                <IconPhoto size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip color="gray" label='Alterar status' position="bottom">
              <ActionIcon disabled={session?.user.USER_ROLE === "USER"} onClick={() => handleOpen('status')} variant="filled" aria-label="Status">
                <IconSettings size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </BackgroundImage>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%' >
          <ResellerDetail reseller={reseller} />
        </Paper>
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        closeOnClickOutside={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
      >
        {modalContent === 'picture' && <ModalPatchLogo reseller={reseller} />}
        {modalContent === 'status' && <ModalPatchStatus reseller={reseller} />}
      </Modal>
    </>
  );
}
