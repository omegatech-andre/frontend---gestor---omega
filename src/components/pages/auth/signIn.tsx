import NotificationShow from "@/components/_ui/notification/notificationShow";
import { schemaAuth } from "@/schemas/auth/schemaAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UsePostReq {
  USER_NAME: string;
  USER_PASSWORD: string;
}

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaAuth),
  });

  const submitForm: SubmitHandler<UsePostReq> = async (formData) => {
    setIsLoading(true);
    const login = await signIn('credentials', {
      USER_NAME: formData.USER_NAME,
      USER_PASSWORD: formData.USER_PASSWORD,
      redirect: false,
    });
    setIsLoading(false);

    if (login?.ok) {
      NotificationShow({
        title: 'Sucesso',
        message: 'Usuário logado com sucesso!',
      });
      redirect('/produtos');
    }

    if (login?.error) {
      if (login.status === 401) {
        NotificationShow({
          title: 'Erro de Login',
          message: 'Usuário ou senha incorretos.',
        });
      } else {
        NotificationShow({
          title: 'Erro',
          message: 'Ocorreu um erro ao tentar fazer o login. Tente novamente mais tarde.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <TextInput
        {...register('USER_NAME')}
        label="Username"
        error={errors.USER_NAME?.message}
        aria-label="Nome de usuário"
        autoComplete="username"
        required
      />
      <PasswordInput
        {...register('USER_PASSWORD')}
        label="Senha"
        error={errors.USER_PASSWORD?.message}
        aria-label="Senha"
        autoComplete="current-password"
        required
      />
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit" disabled={isLoading} loading={isLoading}>
          Entrar
        </Button>
      </Group>
    </form>
  );
}
