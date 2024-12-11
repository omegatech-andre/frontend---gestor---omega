import ProviderNotification from "@/components/_ui/notification/providerNotification";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import { schemaCategory } from "@/schemas/produtos/schemaCategory";
import { CategoryGetDetails, CategoryPostDetails } from "@/types/categoryDetails";
import { LineGetDetails } from "@/types/lineDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  category: CategoryGetDetails;
  inputLabel: string;
  inputValue: string;
  inputField: keyof CategoryPostDetails;
}

export default function ModalPatchDetails({ category, inputLabel, inputValue, inputField }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm<CategoryPostDetails>({
    mode: "onChange",
    resolver: yupResolver(schemaCategory),
    defaultValues: {
      [inputField]: inputValue,
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest: sendPatchRequest } = usePatch<CategoryPostDetails, CategoryGetDetails>(`${API_BASE_URL}/categories/update/${category.CATEGORY_NAME}`, watchData, {
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
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao editar categoria',
        message: error.response?.status === 409 ? 'Você está tantando usar informações cadastradas em outra categoria.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Categoria editada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Categoria atualizada</Text>
        <Text ta='center' c='dimmed'>As Informações da categoria foram atualizadas com sucesso!</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendPatchRequest)}>
        <Stack align="center" gap={0} mb={10}>
          <Text ta='center'>Editar {inputLabel}</Text>
          <Text ta='center' size="sm" c='dimmed'>Digite no campo abaixo o novo valor</Text>
        </Stack>
        {
          inputField === "CATEGORY_DESCRIPTION"
            ? <Controller
              name="CATEGORY_DESCRIPTION"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder={inputValue}
                  minRows={5}
                  autosize
                  value={field.value || inputValue}
                  onChange={(value) => field.onChange(value || "")}
                />
              )}
            />
            : inputField === 'FK_CATEGORY_LINE'
              ? <Controller
                name='FK_CATEGORY_LINE'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Status'
                    allowDeselect={false}
                    value={field.value || inputValue}
                    onChange={(value) => field.onChange(value || "")}
                    data={
                      lines?.data.map((line) => ({
                        value: line.id,
                        label: line.LINE_NAME,
                        disabled: line.LINE_NAME === inputValue,
                      })) || []
                    }
                  />
                )}
              />
              : <Controller
                name={inputField}
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || inputValue}
                    onChange={(value) => field.onChange(value || "")}
                  />
                )}
              />
        }
        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={isUpdating}
            color='green'
            fullWidth
          >
            Salvar
          </Button>
        </Group>
      </form>
    </>
  );
}
