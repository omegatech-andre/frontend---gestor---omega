import { Button, Select, Stack, Text } from "@mantine/core"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { Controller, useForm } from "react-hook-form";
import { schemaReseller } from "../../../../schemas/revendedores/schemaReseller";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResellerGetDetails, ResellerPostDetails } from "@/types/resellerDetails";
import usePatch from "@/hooks/usePatch";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

interface Props {
  reseller?: ResellerGetDetails;
}

export default function ModalPatchStatus({ reseller }: Props) {
  const { data: session } = useSession();
  const { handleSubmit, control, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaReseller),
    defaultValues: {
      RESELLER_STATUS: reseller?.RESELLER_STATUS === 'APPROVED' ? 'DISABLED' : 'APPROVED',
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<ResellerPostDetails, ResellerGetDetails>(`${API_BASE_URL}/resellers/update/${reseller?.RESELLER_FANTASY_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar o status desse revendedor, tente novamente mais tarde.',
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
        <Text ta='center'>Status atualizado</Text>
        <Text ta='center' c='dimmed'>O status do revendedor foi atualizada com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0}>
          <Text ta='center'>Editar status de {reseller?.RESELLER_FANTASY_NAME}</Text>
          <Text ta='center' size="sm" c='dimmed'>
            {
              reseller?.RESELLER_STATUS === 'APPROVED'
                ? 'Esse revendedor já está ativado, deseja desativa-lo?'
                : reseller?.RESELLER_STATUS === 'PENDING'
                  ? 'Esse revendedor ainda está pendente de aprovação, deseja alterar o status?'
                  : 'Esse revendedor nao está ativado, deseja ativa-lo?'
            }
          </Text>
        </Stack>
        <Controller
          name="RESELLER_STATUS"
          control={control}
          render={({ field }) => <Select
            {...field}
            label='Status'
            allowDeselect={false}
            data={[
              { value: 'APPROVED', label: 'Ativado', disabled: reseller?.RESELLER_STATUS === 'APPROVED' },
              { value: 'DISABLED', label: 'Desativado', disabled: reseller?.RESELLER_STATUS === 'DISABLED' },
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
        <Text ta='center' size="xs" c='dimmed' mt={10}>OBS: Revendedores Desativados ou pendentes não são mostrados na lista de revendedores no site oficial</Text>
      </form >
    </>
  );
}
