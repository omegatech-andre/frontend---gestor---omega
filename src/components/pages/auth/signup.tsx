import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface SignupPostValues {
  USER_NAME?: string
  USER_PASSWORD?: string
}

export default function SignUp() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schemaSignup)
  });
  const [posted, setPosted] = useState(false);
  const [data, setData] = useState<SignupPostValues>({ USER_NAME: '', USER_PASSWORD: '' });
  // const { userToken, isPosted, isPosting, error409, error } = usePostUser<SignupPostValues>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, data, posted);

  const submitForm: SubmitHandler<SignupPostValues> = (formData) => {
    setData(formData);
    setPosted(true);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <TextInput
        {...register('USER_NAME')}
        label="Username"
      // error={errors.USER_NAME?.message}
      />
      <PasswordInput
        {...register('USER_PASSWORD')}
        label="Senha"
      />
      <Group justify="flex-end" mt="md">
        <Button fullWidth type="submit">Cadastrar</Button>
      </Group>
    </form>
  );
}
