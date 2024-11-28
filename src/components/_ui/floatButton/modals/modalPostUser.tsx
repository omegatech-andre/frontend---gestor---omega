import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePost from "@/hooks/usePost";
import { schemaUser } from "@/schemas/configuracoes/schemaUser";
import ProviderTheme from "@/styles/providerTheme";
import { UserGetDetails, UserPostDetails } from "@/types/userDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, SimpleGrid, Stack, Switch, Text, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ModalPostUser() {
  const { data: session } = useSession();
  const { isDesktop } = ProviderTheme();
  const { control, handleSubmit, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schemaUser),
    defaultValues: {
      USER_AUTHORIZED: true,
      USER_ROLE: "USER"
    }
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<UserPostDetails, UserGetDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/users/create`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao criar usuário',
        message: error.response?.status === 409 ? 'Já existe um usuario com esse nome.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Usuário criado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack w='15rem' align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center' c='dimmed'>Usuário criado com sucesso</Text>
      </Stack>
    );
  }

  return (
    <>
      <Stack w='80vw' p={isDesktop ? '20' : 0}>
        <Stack gap={0}>
          <Text size="xl" ta='center'>Adicionar novo usuário</Text>
          <Text size="sm" c='dimmed' ta='center'>Preencha os campos abaixo</Text>
        </Stack>
        <form onSubmit={handleSubmit(sendRequest)}>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Controller
                name='USER_NAME'
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label='Nome'
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value || '')}
                  />
                )}
              />
              <Controller
                name='USER_PASSWORD'
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label='Senha'
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value || '')}
                  />
                )}
              />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Controller
                name='USER_ROLE'
                control={control}
                render={({ field }) => (
                  <Switch
                    label='Administrador'
                    checked={field.value === 'ADMIN'}
                    onChange={(event) => field.onChange(event.currentTarget.checked ? 'ADMIN' : 'USER')}
                  />
                )}
              />
            </SimpleGrid>
          </Stack>
          <Group justify="flex-end" mt="md">
            <Button
              fullWidth
              type="submit"
              loading={isPosting}
            >
              Criar usuário
            </Button>
          </Group>
        </form>
      </Stack>
    </>
  );
}
