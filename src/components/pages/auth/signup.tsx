import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePost from "@/hooks/usePost";
import { schemaAuth } from "@/schemas/auth/schemaAuth";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface UsePostReq {
  USER_NAME: string;
  USER_PASSWORD: string;
}

interface UsePostRes {
  access_token: string;
}

export default function SignUp() {
  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaAuth),
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<UsePostReq, UsePostRes>(`${API_BASE_URL}/auth/register`, watchData);

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro' : 'Erro ao registrar',
        message: error.response?.status === 409 ? 'Usuário já existe.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Usuário registrado com sucesso!',
      });
      signIn('credentials', {
        USER_NAME: watchData.USER_NAME,
        USER_PASSWORD: watchData.USER_PASSWORD,
        redirect: false,
      })
        .then((res) => res?.ok && redirect('/produtos'));
    }
  }, [response, error, watchData]);

  return (
    <form onSubmit={handleSubmit(sendRequest)}>
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
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit" disabled={isPosting} loading={isPosting}>
          Cadastrar
        </Button>
      </Group>
    </form>
  );
}
