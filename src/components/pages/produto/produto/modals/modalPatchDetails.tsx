import ProviderNotification from "@/components/_ui/notification/providerNotification";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import { schemaProduct } from "@/schemas/produtos/schemaProduct";
import { CategoryGetDetails } from "@/types/categoryDetails";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  product: ProductGetDetails;
  inputLabel: string;
  inputValue: string | string[];
  inputField: keyof ProductPostDetails;
}

export default function ModalPatchDetails({ product, inputLabel, inputValue, inputField }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm<ProductPostDetails>({
    mode: "onChange",
    resolver: yupResolver(schemaProduct),
    defaultValues: {
      [inputField]: inputValue,
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostDetails, ProductGetDetails>(`${API_BASE_URL}/products/update/${product.PRODUCT_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

  const { response: categories, sendRequest: sendGetRequest } = useGet<CategoryGetDetails[]>(`${API_BASE_URL}/categories`);

  useEffect(() => {
    sendGetRequest();
  }, []);

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao editar produto',
        message: error.response?.status === 409 ? 'Você está tantando usar informações cadastradas em outro produto.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Produto editado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);


  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Produto atualizado</Text>
        <Text ta='center' c='dimmed'>As Informações do produto foram atualizadas com sucesso!</Text>
      </Stack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack align="center" gap={0} mb={10}>
          <Text ta='center'>Editar {inputLabel}</Text>
          <Text ta='center' size="sm" c='dimmed'>Digite no campo abaixo o novo valor</Text>
        </Stack>
        {
          inputField === "PRODUCT_DESCRIPTION"
            ? <Controller
              name="PRODUCT_DESCRIPTION"
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
            : inputField === 'FK_PRODUCT_CATEGORY'
              ? <Controller
                name="FK_PRODUCT_CATEGORY"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Categoria"
                    allowDeselect={false}
                    value={field.value || inputValue as string}
                    onChange={(value) => field.onChange(value || "")}
                    data={
                      categories?.data.map((categoria) => ({
                        value: categoria.id,
                        label: categoria.CATEGORY_NAME,
                        disabled: categoria.CATEGORY_NAME === inputValue,
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
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : Array.isArray(field.value)
                          ? field.value.map(item => typeof item === "string" ? item : JSON.stringify(item)).join(", ")
                          : field.value
                            ? JSON.stringify(field.value)
                            : inputValue
                    }
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
