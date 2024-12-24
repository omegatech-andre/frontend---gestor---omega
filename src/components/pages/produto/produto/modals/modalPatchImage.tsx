import { Button, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import usePatch from "@/hooks/usePatch";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { ProductGetDetails, ProductPostFile } from "@/types/productDetails";
import { FileWithPath } from "@mantine/dropzone";

interface Props {
  product: ProductGetDetails;
  image: string;
}

export default function ModalPatchImage({ product, image }: Props) {
  const { data: session } = useSession();

  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostFile, ProductGetDetails>(`${API_BASE_URL}/products/remove-image/${product.PRODUCT_NAME}`, { PRODUCT_URL_IMAGES: [image] as unknown as FileWithPath }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível deletar a imagem desse produto, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Imagem dedletada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Produto atualizado</Text>
        <Text ta='center' c='dimmed'>A imagem do produto foi atualizado.</Text>
      </Stack>
    );
  }

  return (
    <>
      <Stack align="center" gap={0}>
        <Text ta='center'>Deletar image de {product.PRODUCT_NAME}</Text>
        <Text ta='center' size="sm" c='dimmed'>Deseja realmente deletar essa imagem?</Text>
      </Stack>
      <Button
        onClick={sendRequest}
        type='submit'
        fullWidth
        mt="md"
        loading={isUpdating}
      >
        Deletar imagem
      </Button>
    </>
  );
}
