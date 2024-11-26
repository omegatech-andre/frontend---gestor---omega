import { Button, Stack, Text } from "@mantine/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { IconCircleCheckFilled, IconLock, IconLockOpen } from "@tabler/icons-react";
import { schemaUser } from "../../../../schemas/configuracoes/schemaUser";
import usePatch from "@/hooks/usePatch";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { UserDetails } from "@/types/userDetails";
import { useSession } from "next-auth/react";


interface Props {
  user: UserDetails;
}

interface UsePatchReq {
  USER_AUTHORIZED?: boolean;
}

export default function ModalEditPermission({ user }: Props) {
  const { data: session } = useSession();
  const { handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaUser)
  });

  const { isUpdating, response, error, sendRequest } = usePatch<UsePatchReq, UserDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update/${user.id}`, { USER_AUTHORIZED: !user.USER_AUTHORIZED }, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: 'Erro',
        message: 'Não foi possível alterar a permissão desse usuario, tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Permissão atualizada com sucesso!',
        reload: true
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Permissão atualizada</Text>
        <Text ta='center' c='dimmed'>A permissão do usuário foi atualizada com sucesso.</Text>
      </Stack>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0}>
          <Text ta='center'>Editar permissão de {user.USER_NAME}</Text>
          <Text ta='center' size="sm" c='dimmed'>{user.USER_AUTHORIZED ? 'Esse usuário já tem permissão, deseja retirar?' : 'Esse usuário ainda nao é autorizado, deseja dar permissão?'}</Text>
        </Stack>
        <Button
          type='submit'
          fullWidth
          mt="md"
          leftSection={user.USER_AUTHORIZED ? <IconLock size={20} /> : <IconLockOpen size={20} />}
          color={user.USER_AUTHORIZED ? 'red' : 'green'}
          loading={isUpdating}
          disabled={isUpdating}
        >
          {user.USER_AUTHORIZED ? `Retirar permissão` : `Dar permissão`}
        </Button>
      </form>
    </>
  )
}
