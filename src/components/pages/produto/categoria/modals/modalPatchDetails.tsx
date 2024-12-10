import ProviderNotification from "@/components/_ui/notification/providerNotification";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import { CategoryGetDetails, CategoryPostDetails } from "@/types/categoryDetails";
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
    // resolver: yupResolver(schemaLine),
    defaultValues: {
      [inputField]: inputValue,
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest: sendPatchRequest } = usePatch<CategoryPostDetails, CategoryGetDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/update/${category.CATEGORY_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

  const { isGetting, response: lines, sendRequest: sendGetRequest } = useGet<CategoryGetDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/lines`);
  console.log(lines)

  useEffect(() => {
    sendGetRequest();
  }, [sendGetRequest]);

  if (!lines) return;

  if (isGetting) {
    return <p>Carregando...</p>; // Retorna um estado de carregamento e interrompe a renderização
  }

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
                  placeholder="Digite a descrição..."
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
                render={({ field }) => <Select
                  {...field}
                  label='Status'
                  allowDeselect={false}
                  data={lines.data.map((line) => ({ value: line.id, label: line.CATEGORY_NAME })) || []}
                />}
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
