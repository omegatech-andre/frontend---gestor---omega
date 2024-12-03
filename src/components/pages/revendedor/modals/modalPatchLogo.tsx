import { Button, Paper, Stack, Text } from "@mantine/core";
import { IconCircleCheckFilled, IconCloudUpload } from "@tabler/icons-react";
import { ResellerGetDetails } from "@/types/resellerDetails";
import { useEffect, useState } from "react";
import usePatch from "@/hooks/usePatch";
import { useSession } from "next-auth/react";
import { FileWithPath } from "@mantine/dropzone";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import CustomDropZone from "@/components/_ui/dropzone/customDropzone";

interface Props {
  reseller: ResellerGetDetails;
}

export default function ModalPatchLogo({ reseller }: Props) {
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const { isUpdating, response, error, sendRequest } = usePatch(`${process.env.NEXT_PUBLIC_BASE_URL}/resellers/upload-logo/${reseller.RESELLER_FANTASY_NAME}`, { RESELLER_URL_LOGO: files[0] }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar a logo desse revendedor, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Logo atualizada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Logo atualizada</Text>
        <Text ta='center' c='dimmed'>A logo do revendedor foi atualizada com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <>
      <Paper withBorder bg="#8a8a8a20">
        <CustomDropZone name="Logo" w="200" h="200" files={files} setFiles={setFiles} />
      </Paper>
      <Button
        onClick={sendRequest}
        type='submit'
        fullWidth
        mt="md"
        leftSection={<IconCloudUpload size={20} />}
        loading={isUpdating}
        disabled={files.length === 0}
      >
        Salvar
      </Button>
    </>
  );
}
