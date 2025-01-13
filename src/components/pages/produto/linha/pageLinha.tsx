import { ActionIcon, Badge, Card, Flex, Group, Image, Modal, Paper, Stack, Text, Tooltip } from "@mantine/core"
import { IconPhoto, IconSettings } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { LineGetDetails } from "@/types/lineDetails"
import ProviderTheme from "@/styles/providerTheme"
import MenuNavigation from "@/components/_ui/menuNavigation/menuNavigation"
import ModalPatchStatus from "./modals/modalPatchStatus"
import LineDetail from "./lineDetails"
import ModalPatchImage from "./modals/modalPatchImage"
import { API_BASE_URL } from "@/utils/apiBaseUrl"
import { useSession } from "next-auth/react"

interface Props {
  line: LineGetDetails;
}

export default function PageLinha({ line }: Props) {
  const { data: session } = useSession();
  const { isDesktop, isSmallDevice } = ProviderTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'picture' | 'status' | 'delete' | ''>('');

  const handleOpen = (content: 'picture' | 'status' | 'delete') => {
    setModalContent(content);
    open();
  };

  return (
    <>
      <Stack h='100%' align="center" >
        <MenuNavigation />
        <Card w='100%' shadow="sm" padding="sm" radius="md" withBorder>
          <Card.Section>
            <Image src={line.LINE_URL_IMAGE ? `${API_BASE_URL}${line.LINE_URL_IMAGE}` : '/tumblr_0.webp'} height={200} />
          </Card.Section>
          <Flex direction={isSmallDevice ? 'row' : 'column'} mt='sm' gap='xs'>
            <Text fz='h1' inline>LINHA {line.LINE_NAME.toUpperCase()}</Text>
            <Group flex={1} justify="space-between">
              {
                line.LINE_STATUS === 'APPROVED'
                  ? <Badge variant='default' c='green'>ativo</Badge>
                  : line.LINE_STATUS === 'PENDING'
                    ? <Badge variant='default' c='yellow'>pendente</Badge>
                    : <Badge variant='default' c='dimmed'>desativ.</Badge>
              }
              <Group gap={5}>
                <Tooltip color="gray" label='Aterar wallpaper' position="bottom">
                  <ActionIcon disabled={session?.user.USER_ROLE === "USER"} onClick={() => handleOpen('picture')} variant="filled" aria-label="Picture">
                    <IconPhoto size={20} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip color="gray" label='Alterar status' position="bottom">
                  <ActionIcon disabled={session?.user.USER_ROLE === "USER"} onClick={() => handleOpen('status')} variant="filled" aria-label="Status">
                    <IconSettings size={20} />
                  </ActionIcon>
                </Tooltip>
                {/* <Tooltip color="gray" label='Deletar linha' position="bottom">
                  <ActionIcon onClick={() => handleOpen('delete')} variant="filled" aria-label="Delete">
                    <IconTrash size={20} />
                  </ActionIcon>
                </Tooltip> */}
              </Group>
            </Group>
          </Flex>
        </Card>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%' >
          <LineDetail line={line} />
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
        {modalContent === 'picture' && <ModalPatchImage line={line} />}
        {modalContent === 'status' && <ModalPatchStatus line={line} />}
        {/* {modalContent === 'delete' && <ModalDeleteLine line={line} />} */}
      </Modal>
    </>
  );
}
