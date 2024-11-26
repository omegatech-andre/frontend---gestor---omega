import { Button, Stack, Text } from "@mantine/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { IconCircleCheckFilled, IconLockOpen } from "@tabler/icons-react";
import { schemaUser } from "../../../../schemas/configuracoes/schemaUser";
import { UserDetails } from "../../../../types/userDetails";
import { useSession } from "next-auth/react";
import usePatch from "@/hooks/usePatch";
import ProviderNotification from "@/components/_ui/notification/providerNotification";

interface Props {
  user: UserDetails;
}

interface UsePatchReq {
  USER_ROLE?: string;
  USER_AUTHORIZED?: boolean;
}

export default function ModalPatchAdmin({ user }: Props) {
  const { data: session } = useSession();
  const { handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaUser)
  });

  const { isUpdating, response, error, sendRequest } = usePatch<UsePatchReq, UserDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update/${user.id}`, { USER_ROLE: 'ADMIN', USER_AUTHORIZED: true }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar função deste usuário, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Função atualizada com sucesso!',
        reload: true
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Função atualizada</Text>
        <Text ta='center' c='dimmed'>O usuário {user.USER_NAME} agora é administrador</Text>
      </Stack>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0}>
          <Text ta='center'>Editar função de {user.USER_NAME}</Text>
          <Text ta='center' size="sm" c='dimmed'>Deseja dar poder de administrador para esse usuário?</Text>
        </Stack>
        <Button
          type='submit'
          fullWidth
          mt="md"
          color='green'
          leftSection={<IconLockOpen size={20} />}
          loading={isUpdating}
        >
          Dar administrador
        </Button>
      </form>
    </>
  )
}
