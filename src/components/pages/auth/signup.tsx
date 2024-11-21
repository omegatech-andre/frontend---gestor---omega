import NotificationShow from "@/components/_ui/notification/notificationShow";
import usePost from "@/hooks/usePost";
import { schemaAuth } from "@/schemas/auth/schemaAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UsePostReq {
  USER_NAME: string;
  USER_PASSWORD: string;
}

interface UsePostRes {
  access_token: string;
}

export default function SignUp() {
  const { register, handleSubmit, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaAuth),
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<UsePostReq, UsePostRes>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, watchData);

  useEffect(() => {
    if (error) {
      NotificationShow({
        title: error.response?.status === 409 ? 'Erro' : 'Erro ao registrar',
        message: error.response?.status === 409 ? 'Usuário já existe.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      NotificationShow({
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
      <TextInput
        {...register('USER_NAME')}
        label="Username"
        aria-label="Nome de usuário"
      />
      <PasswordInput
        {...register('USER_PASSWORD')}
        label="Senha"
        aria-label="Senha"
        minLength={6}
      />
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit" disabled={isPosting} loading={isPosting}>
          Cadastrar
        </Button>
      </Group>
    </form>
  );
}
