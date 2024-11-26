import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePatch from "@/hooks/usePatch";
import { schemaUser } from "@/schemas/configuracoes/schemaUser";
import { UserDetails } from "@/types/userDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, Stack, Text } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Session } from "next-auth";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  user: Session['user'] | undefined;
}

interface UsePatchReq {
  USER_PASSWORD?: string;
}

export default function ModalPatchPassword({ user }: Props) {
  const { control, handleSubmit, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schemaUser)
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<UsePatchReq, UserDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update/${user?.id}`, watchData, {
    headers: {
      Authorization: `Bearer ${user?.access_token}`
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar a senha, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Senha atualizada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center' c='dimmed'>Senha atualizada com sucesso</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Controller
          name='USER_PASSWORD'
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              label='Nova senha'
              required
              value={field.value || ''}
              onChange={(value) => field.onChange(value || '')}
            />
          )}
        />
        <Group justify="flex-end" mt="md">
          <Button
            fullWidth
            type="submit"
            loading={isUpdating}
          >
            Salvar nova senha
          </Button>
        </Group>
      </form>
    </>
  );
}
