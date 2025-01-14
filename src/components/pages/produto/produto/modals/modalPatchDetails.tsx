import { productSizeOptions } from "@/components/_ui/floatButton/modals/utils/productSizeOptions";
import { productTagOptions } from "@/components/_ui/floatButton/modals/utils/productTagOptions";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import { schemaProduct } from "@/schemas/produtos/schemaProduct";
import { CategoryGetDetails } from "@/types/categoryDetails";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, MultiSelect, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  product: ProductGetDetails;
  inputLabel: string | undefined;
  inputValue: string | string[] | { COLOR_NAME: string; COLOR_HEX: string }[] | undefined;
  inputField: keyof ProductPostDetails | undefined;
}

export default function ModalPatchDetails({ product, inputLabel, inputValue, inputField }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm<ProductPostDetails>({
    mode: "onChange",
    resolver: yupResolver(schemaProduct),
    defaultValues: {
      [inputField as keyof ProductGetDetails]: inputValue,
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
          <Text ta='center' size="sm" c='dimmed'>
            {
              inputField === 'PRODUCT_SIZES'
                ? 'Selecione os tamanhos a baixo'
                : inputField === 'PRODUCT_TAGS'
                  ? 'Selecione as tags a baixo'
                  : 'Digite no campo abaixo o novo valor'
            }
          </Text>
        </Stack>
        {
          inputField === "PRODUCT_NAME"
          && <Controller
            name="PRODUCT_NAME"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                value={field.value || inputValue as string}
                onChange={(value) => field.onChange(value || "")}
              />
            )}
          />
        }
        {
          inputField === "PRODUCT_DESCRIPTION"
          && <Controller
            name="PRODUCT_DESCRIPTION"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Digite a descrição..."
                minRows={5}
                autosize
                value={field.value || inputValue as string}
                onChange={(value) => field.onChange(value || "")}
              />
            )}
          />
        }
        {
          inputField === 'FK_PRODUCT_CATEGORY'
          && <Controller
            name="FK_PRODUCT_CATEGORY"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
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
        }
        {
          inputField === "PRODUCT_SIZES"
          && <Controller
            name="PRODUCT_SIZES"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                value={(field.value || []).filter((item): item is string => !!item)}
                onChange={(value) => field.onChange(value)}
                data={productSizeOptions}
                hidePickedOptions
              />
            )}
          />
        }
        {
          inputField === "PRODUCT_TAGS"
          && <Controller
            name="PRODUCT_TAGS"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                value={(field.value || []).filter((item): item is string => !!item)}
                onChange={(value) => field.onChange(value)}
                data={productTagOptions}
                hidePickedOptions
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
