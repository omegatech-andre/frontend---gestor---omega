import DropzonePicture from "@/components/_ui/dropzone/dropzonePicture";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePatch from "@/hooks/usePatch";
import { ProductGetDetails, ProductPostDetails, ProductPostFile } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { Button, Paper, Stack, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { IconCircleCheckFilled, IconCloudUpload } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Props {
  product: ProductGetDetails;
  inputLabel: string;
  inputValue: string | string[] | { COLOR_NAME: string; COLOR_HEX: string }[];
  inputField: keyof ProductPostDetails;
}

export default function ModalPatchBoletim({ product }: Props) {
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostFile, ProductGetDetails>(`${API_BASE_URL}/products/upload-boletim/${product.PRODUCT_NAME}`, { PRODUCT_BOLETIM: files[0] }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar o boletim desse produto, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Boletim atualizada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Boletim atualizada</Text>
        <Text ta='center' c='dimmed'>O boletim do produto foi atualizada com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <>
      <Paper withBorder bg="#8a8a8a20">
        <DropzonePicture fileType="application/pdf" name="boletim" size='5mb' files={files} setFiles={setFiles} />
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
