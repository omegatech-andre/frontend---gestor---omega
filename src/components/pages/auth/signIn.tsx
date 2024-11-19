import NotificationShow from "@/components/_ui/notification/notificationShow";
import usePost from "@/hooks/usePost";
import { schemaAuth } from "@/schemas/auth/schemaAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UsePostReq {
  USER_NAME: string;
  USER_PASSWORD: string;
}

interface UsePostRes {
  access_token: string;
}

export default function Signin() {
  const { register, handleSubmit, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaAuth),
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<UsePostReq, UsePostRes>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, watchData);

  // TODO - no response.data eu recebo o { access_token: string }

  useEffect(() => {
    if (error) {
      NotificationShow({
        title: 'Erro',
        message: 'Ocorreu um erro ao tentar fazer o login.',
      });
    }

    if (response) {
      NotificationShow({
        title: 'Sucesso',
        message: 'Usuário logado com sucesso!',
      });
    }
  }, [error, response]);

  return (
    <form onSubmit={handleSubmit(sendRequest)}>
      <TextInput
        {...register('USER_NAME')}
        label="Username"
      />
      <PasswordInput
        {...register('USER_PASSWORD')}
        label="Senha"
      />
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit" disabled={isPosting} loading={isPosting}>
          Entrar
        </Button>
      </Group>
    </form>
  );
}