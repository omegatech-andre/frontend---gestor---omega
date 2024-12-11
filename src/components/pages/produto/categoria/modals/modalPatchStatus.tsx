import { Button, Select, Stack, Text } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import usePatch from "@/hooks/usePatch";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaCategory } from "@/schemas/produtos/schemaCategory";
import { CategoryGetDetails, CategoryPostDetails } from "@/types/categoryDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

interface Props {
  category?: CategoryGetDetails;
}

export default function ModalPatchStatus({ category }: Props) {
  const { data: session } = useSession();
  const { handleSubmit, control, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaCategory),
    defaultValues: {
      CATEGORY_STATUS: category?.CATEGORY_STATUS === 'APPROVED' ? 'DISABLED' : 'APPROVED',
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<CategoryPostDetails, CategoryGetDetails>(`${API_BASE_URL}/categories/update/${category?.CATEGORY_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar o status dessa categoria, tente novamente mais tarde.',
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
        <Text ta='center'>Categoria atualizada</Text>
        <Text ta='center' c='dimmed'>O status da categoria foi atualizado.</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0}>
          <Text ta='center'>Editar status de {category?.CATEGORY_NAME}</Text>
          <Text ta='center' size="sm" c='dimmed'>
            {
              category?.CATEGORY_STATUS === 'APPROVED'
                ? 'Essa linha está ativada, deseja desativa-la?'
                : category?.CATEGORY_STATUS === 'PENDING'
                  ? 'Essa linha ainda está pendente de aprovação, deseja alterar o status?'
                  : 'Esse linha não está ativada, deseja ativa-la?'
            }
          </Text>
        </Stack>
        <Controller
          name='CATEGORY_STATUS'
          control={control}
          render={({ field }) => <Select
            {...field}
            label='Status'
            allowDeselect={false}
            data={[
              { value: 'APPROVED', label: 'Ativado', disabled: category?.CATEGORY_STATUS === 'APPROVED' },
              { value: 'DISABLED', label: 'Desativado', disabled: category?.CATEGORY_STATUS === 'DISABLED' },
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
        <Text ta='center' size="xs" c='dimmed' mt={10}>OBS: Uma categoria desativada fica oculta no site oficial, por consequência os produtos dessa linha tambem não serão mostrados.</Text>
      </form>
    </>
  );
}
