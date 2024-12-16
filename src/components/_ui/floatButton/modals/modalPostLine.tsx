import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { schemaLine } from "../../../../schemas/produtos/schemaLine";
import { LineGetDetails, LinePostDetails } from "../../../../types/lineDetails";
import { useEffect } from "react";
import { Button, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import usePost from "@/hooks/usePost";
import { useSession } from "next-auth/react";
import ProviderNotification from "../../notification/providerNotification";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

export default function ModalPostLine() {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaLine),
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<LinePostDetails, LineGetDetails>(`${API_BASE_URL}/lines/create`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao criar linha',
        message: error.response?.status === 409 ? 'Você está cadastrando uma linha que já existe.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Linha criada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Sucesso</Text>
        <Text ta='center' c='dimmed'>A linha foi criada com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <Stack w='80vw' p={0}>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack gap='lg'>
          <SimpleGrid cols={{ base: 1, sm: 1 }}>
            <Controller
              name='LINE_NAME'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Nome'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='LINE_DESCRIPTION'
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label='Descrição'
                  minRows={5}
                  autosize
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || "")}
                />
              )}
            />
          </SimpleGrid>
          <Button
            type='submit'
            fullWidth
            loading={isPosting}
          >
            Criar linha
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
