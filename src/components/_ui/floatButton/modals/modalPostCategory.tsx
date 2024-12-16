import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LineGetDetails } from "../../../../types/lineDetails";
import { useEffect } from "react";
import { Button, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import usePost from "@/hooks/usePost";
import { useSession } from "next-auth/react";
import ProviderNotification from "../../notification/providerNotification";
import { schemaCategory } from "@/schemas/produtos/schemaCategory";
import { CategoryGetDetails, CategoryPostDetails } from "@/types/categoryDetails";
import useGet from "@/hooks/useGet";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

export default function ModalPostCategory() {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaCategory),
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest: sendPostRquest } = usePost<CategoryPostDetails, CategoryGetDetails>(`${API_BASE_URL}/categories/create`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

  const { response: lines, sendRequest: sendGetRequest } = useGet<LineGetDetails[]>(`${API_BASE_URL}/lines`);

  useEffect(() => {
    sendGetRequest();
  }, []);

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao criar categoria',
        message: error.response?.status === 409 ? 'Você está cadastrando uma categoria que já existe.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Categoria criada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Sucesso</Text>
        <Text ta='center' c='dimmed'>A categoria foi criada com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <Stack w='80vw' p={0}>
      <form onSubmit={handleSubmit(sendPostRquest)}>
        <Stack gap='lg'>
          <SimpleGrid cols={{ base: 1, sm: 1 }}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Controller
                name='CATEGORY_NAME'
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
                name='FK_CATEGORY_LINE'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Linha'
                    allowDeselect={false}
                    required
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value || "")}
                    data={
                      lines?.data.map((line) => ({
                        value: line.id,
                        label: line.LINE_NAME,
                      })) || []
                    }
                  />
                )}
              />
            </SimpleGrid>
            <Controller
              name='CATEGORY_DESCRIPTION'
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
            Criar categoria
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
