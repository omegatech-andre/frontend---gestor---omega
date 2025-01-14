import ProviderAvatar from "@/components/_ui/avatar/providerAvatar";
import ProviderTheme from "@/styles/providerTheme";
import { ActionIcon, BackgroundImage, Modal, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconKey } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import UsersList from "./userList";
import ModalPatchPassword from "./modals/modalPatchPassword";

export default function PageConfiguracoes() {
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme, isDesktop } = ProviderTheme();

  return (
    <>
      <Stack h='100%' align="center" >
        <BackgroundImage src="/tumblr_0.webp" ta='center' p='20' radius={10} style={{
          backgroundPosition: 'right'
        }}>
          <Paper bg={colorScheme} m='auto' w='max-content' radius={100} p={5}>
            <ProviderAvatar name={session?.user.USER_NAME || ''} size={120} />
          </Paper>
          <Text my={10}>{session?.user.USER_NAME}</Text>
          <Tooltip color="gray" label='Aterar senha' position="bottom">
            <ActionIcon onClick={open} variant="filled" aria-label="Settings">
              <IconKey size={20} />
            </ActionIcon>
          </Tooltip>
        </BackgroundImage>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%'>
          <UsersList />
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
        <ModalPatchPassword user={session?.user} />
      </Modal>
    </>
  );
}
