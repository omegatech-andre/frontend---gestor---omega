import { Button, Select, Stack, Text } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import usePatch from "@/hooks/usePatch";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { schemaProduct } from "@/schemas/produtos/schemaProduct";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";

interface Props {
  product?: ProductGetDetails;
}

export default function ModalPatchStatus({ product }: Props) {
  const { data: session } = useSession();
  const { handleSubmit, control, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaProduct),
    defaultValues: {
      PRODUCT_STATUS: product?.PRODUCT_STATUS === 'APPROVED' ? 'DISABLED' : 'APPROVED',
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostDetails, ProductGetDetails>(`${API_BASE_URL}/products/update/${product?.PRODUCT_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar o status desse produto, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Status atualizado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Produto atualizado</Text>
        <Text ta='center' c='dimmed'>O status do produto foi atualizado.</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0}>
          <Text ta='center'>Editar status de {product?.PRODUCT_NAME}</Text>
          <Text ta='center' size="sm" c='dimmed'>
            {
              product?.PRODUCT_STATUS === 'APPROVED'
                ? 'Esse produto está ativado, deseja desativa-lo?'
                : product?.PRODUCT_STATUS === 'PENDING'
                  ? 'Esse produto ainda está pendente de aprovação, deseja alterar o status?'
                  : 'Esse produto não está ativado, deseja ativa-lo?'
            }
          </Text>
        </Stack>
        <Controller
          name='PRODUCT_STATUS'
          control={control}
          render={({ field }) => <Select
            {...field}
            label='Status'
            allowDeselect={false}
            data={[
              { value: 'APPROVED', label: 'Ativado', disabled: product?.PRODUCT_STATUS === 'APPROVED' },
              { value: 'DISABLED', label: 'Desativado', disabled: product?.PRODUCT_STATUS === 'DISABLED' },
            ]}
          />}
        />
        <Button
          type='submit'
          fullWidth
          mt="md"
          loading={isUpdating}
        >
          Salvar
        </Button>
        <Text ta='center' size="xs" c='dimmed' mt={10}>OBS: Um produto desativado fica oculto no site oficial.</Text>
      </form>
    </>
  );
}
