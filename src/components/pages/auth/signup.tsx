import NotificationShow from "@/components/_ui/notification/notificationShow";
import usePost from "@/hooks/usePost";
import { schemaSignup } from "@/schemas/auth/schemaSignUp";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UsePostReq {
  USER_NAME?: string;
  USER_PASSWORD?: string;
}

interface UsePostRes {
  access_token: string;
}

export default function SignUp() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaSignup),
  });
  const watchData = watch();

  const { isPosting, response, error, sendRequest } = usePost<UsePostReq, UsePostRes>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, watchData);

  // TODO - no response.data eu recebo o { access_token: string }

  useEffect(() => {
    if (error) {
      if (error.response?.status === 409) {
        NotificationShow({
          title: 'Erro',
          message: 'Já existe um usuario com essas credênciais.',
        });
        return;
      }
      NotificationShow({
        title: 'Erro',
        message: 'Ocorreu um erro ao registrar.',
      });
    }

    if (response) {
      NotificationShow({
        title: 'Sucesso',
        message: 'Usuário registrado com sucesso!',
      });
    }
  }, [error, response]);

  return (
    <form onSubmit={handleSubmit(sendRequest)}>
      <TextInput
        {...register('USER_NAME')}
        label="Username"
        error={errors.USER_NAME?.message}
        required
      />
      <PasswordInput
        {...register('USER_PASSWORD')}
        label="Senha"
        required
      />
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit" disabled={isPosting} loading={isPosting}>
          Cadastrar
        </Button>
      </Group>
    </form>
  );
}
