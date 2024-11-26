import ProviderNotification from "@/components/_ui/notification/providerNotification";
import { schemaAuth } from "@/schemas/auth/schemaAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface UsePostReq {
  USER_NAME: string;
  USER_PASSWORD: string;
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaAuth),
  });

  const submitForm: SubmitHandler<UsePostReq> = async (formData) => {
    setIsLoading(true);
    signIn('credentials', {
      USER_NAME: formData.USER_NAME,
      USER_PASSWORD: formData.USER_PASSWORD,
      redirect: false,
    })
      .then((res) => {
        setIsLoading(false);
        if (res?.error) {
          ProviderNotification({
            title: res.status === 401 ? 'Erro de Login' : 'Erro',
            message: res.status === 401 ? 'Usuário ou senha incorretos.' : 'Ocorreu um erro ao tentar fazer o login. Tente novamente mais tarde.',
          });
        }
        if (res?.ok) {
          ProviderNotification({
            title: 'Sucesso',
            message: 'Usuário logado com sucesso!',
          });
          redirect('/produtos');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
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
        <Button fullWidth type="submit" disabled={isLoading} loading={isLoading}>
          Entrar
        </Button>
      </Group>
    </form>
  );
}
