import { schemaAuth } from "@/schemas/auth/schemaAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const submitForm: SubmitHandler<UsePostReq> = async (formData) => {
    const login = await signIn('credentials', {
      USER_NAME: formData.USER_NAME,
      USER_PASSWORD: formData.USER_PASSWORD,
      redirect: false,
    });

    if (login?.ok) redirect('/produtos')
  };

  // useEffect(() => {
  //   if (error) {
  //     NotificationShow({
  //       title: 'Erro',
  //       message: 'Ocorreu um erro ao tentar fazer o login.',
  //     });
  //   }

  //   if (response) {
  //     NotificationShow({
  //       title: 'Sucesso',
  //       message: 'Usuário logado com sucesso!',
  //     });
  //   }
  // }, [error, response]);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <TextInput
        {...register('USER_NAME')}
        label="Username"
      />
      <PasswordInput
        {...register('USER_PASSWORD')}
        label="Senha"
      />
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit">
          Entrar
        </Button>
        {/* <Button fullWidth type="submit" disabled={isPosting} loading={isPosting}>
          Entrar
        </Button> */}
      </Group>
    </form>
  );
}