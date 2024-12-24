import { Button, Paper, Stack, Text } from "@mantine/core";
import { IconCircleCheckFilled, IconCloudUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import usePatch from "@/hooks/usePatch";
import { useSession } from "next-auth/react";
import { FileWithPath } from "@mantine/dropzone";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import DropzonePicture from "@/components/_ui/dropzone/dropzonePicture";
import { ProductGetDetails, ProductPostFile } from "@/types/productDetails";

interface Props {
  productName: string;
}

export default function ModalPostImage({ productName }: Props) {
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostFile, ProductGetDetails>(`${API_BASE_URL}/products/upload-image/${productName}`, { PRODUCT_URL_IMAGES: files[0] }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível adicionar imagem a esse produto, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Imagem adicionada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Imagem adicionada</Text>
        <Text ta='center' c='dimmed'>A imagem foi adicionada com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <>
      <Paper withBorder bg="#8a8a8a20">
        <DropzonePicture fileType="image/webp" name="imagem" width="500" hight="500" size='500Kb' files={files} setFiles={setFiles} />
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
