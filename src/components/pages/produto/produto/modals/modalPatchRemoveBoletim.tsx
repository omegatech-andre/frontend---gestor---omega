import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePatch from "@/hooks/usePatch";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { Button, Stack, Text } from "@mantine/core";
import { IconCircleCheckFilled, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface Props {
  product: ProductGetDetails;
  inputLabel: string | undefined;
  inputValue: string | string[] | { COLOR_NAME: string; COLOR_HEX: string }[] | undefined;
}

export default function ModalPatchRemoveBoletim({ product, inputLabel, inputValue }: Props) {
  const { data: session } = useSession();

  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostDetails, ProductGetDetails>(`${API_BASE_URL}/products/remove-boletim/${product.PRODUCT_NAME}`, { PRODUCT_BOLETIM: inputValue as string }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível deletar o Boletim técnico desse produto, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Boletim técnico deletado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Boletim Técnico deletado</Text>
        <Text ta='center' c='dimmed'>O Boletim Técnico do produto foi deletado com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <>
      <Stack align="center" gap={0} mb={10}>
        <Text ta='center'>Deletar {inputLabel}</Text>
        <Text ta='center' size="sm" c='dimmed'>Realmente deseja deletar o boletim técnico desse produto?</Text>
      </Stack>
      <Button
        onClick={sendRequest}
        fullWidth
        mt="md"
        leftSection={<IconTrash size={20} />}
        loading={isUpdating}
      >
        Deletar
      </Button>
    </>
  );
}
