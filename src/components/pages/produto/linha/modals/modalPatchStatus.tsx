import { Button, Select, Stack, Text } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { LineGetDetails, LinePostDetails } from "@/types/lineDetails";
import { useSession } from "next-auth/react";
import usePatch from "@/hooks/usePatch";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaLine } from "@/schemas/produtos/schemaLine";

interface Props {
  line: LineGetDetails;
}

export default function ModalPatchStatus({ line }: Props) {
  const { data: session } = useSession();
  const { handleSubmit, control, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaLine),
    defaultValues: {
      LINE_STATUS: line.LINE_STATUS === 'APPROVED' ? 'DISABLED' : 'APPROVED',
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<LinePostDetails, LineGetDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/lines/update/${line.LINE_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar o status dessa linha, tente novamente mais tarde.',
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
        <Text ta='center'>Linha atualizada</Text>
        <Text ta='center' c='dimmed'>O status da linha foi atualizado.</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0}>
          <Text ta='center'>Editar status de {line?.LINE_NAME}</Text>
          <Text ta='center' size="sm" c='dimmed'>
            {
              line?.LINE_STATUS === 'APPROVED'
                ? 'Essa linha está ativada, deseja desativa-la?'
                : line.LINE_STATUS === 'PENDING'
                  ? 'Essa linha ainda está pendente de aprovação, deseja alterar o status?'
                  : 'Esse linha não está ativada, deseja ativa-la?'
            }
          </Text>
        </Stack>
        <Controller
          name='LINE_STATUS'
          control={control}
          render={({ field }) => <Select
            {...field}
            label='Status'
            allowDeselect={false}
            data={[
              { value: 'APPROVED', label: 'Aprovado', disabled: line?.LINE_STATUS === 'APPROVED' },
              { value: 'DISABLED', label: 'Desaprovado', disabled: line?.LINE_STATUS === 'DISABLED' },
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
        <Text ta='center' size="xs" c='dimmed' mt={10}>OBS: Linhas desativadas não são mostrados na lista de linhas no site oficial</Text>
      </form>
    </>
  );
}
