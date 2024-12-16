import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react";
import { Button, ColorSwatch, Group, MultiSelect, MultiSelectProps, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { schemaProduct } from "@/schemas/produtos/schemaProduct";
import { useSession } from "next-auth/react";
import usePost from "@/hooks/usePost";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import ProviderNotification from "../../notification/providerNotification";
import useGet from "@/hooks/useGet";
import { CategoryGetDetails } from "@/types/categoryDetails";
import { productTagOptions } from "./utils/productTagOptions";
import { productColorOptions } from "./utils/productColorOptions";
import { productSizeOptions } from "./utils/productSizeOptions";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";

const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => (
  <Group>
    <ColorSwatch radius={0} size={16} color={option.value} />
    {option.label}
  </Group>
);

export default function ModalPostProduct() {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaProduct),
    defaultValues: {
      PRODUCT_COLORS: [],
    },
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest: sendPostRequest } = usePost<ProductPostDetails, ProductGetDetails>(`${API_BASE_URL}/products/create`, watchData, {
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
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao criar produto',
        message: error.response?.status === 409 ? 'Você está cadastrando uma produto que já existe.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Produto criado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Sucesso</Text>
        <Text ta='center' c='dimmed'>O produto foi criado com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <Stack w='80vw' p={0}>
      <form onSubmit={handleSubmit(sendPostRequest)}>
        <Stack gap={30}>
          <SimpleGrid cols={{ base: 1, sm: 1 }}>
            <Controller
              name='PRODUCT_NAME'
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
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Controller
                name='FK_PRODUCT_CATEGORY'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Categoria'
                    allowDeselect={false}
                    required
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value || "")}
                    data={
                      categories?.data.map((category) => ({
                        value: category.id,
                        label: category.CATEGORY_NAME,
                      })) || []
                    }
                  />
                )}
              />
              <Controller
                name="PRODUCT_TAGS"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    label="Tipo"
                    value={(field.value || []).filter((item): item is string => !!item)}
                    onChange={(value) => field.onChange(value)}
                    data={productTagOptions}
                    hidePickedOptions
                  />
                )}
              />
              <Controller
                name="PRODUCT_COLORS"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    label="Cores"
                    value={(field.value || []).map((item) => item.COLOR_HEX || '')}
                    onChange={(selectedValues) => {
                      const updatedColors = selectedValues.map((hex) => {
                        const selectedColor = productColorOptions.find((color) => color.value === hex);
                        return {
                          COLOR_NAME: selectedColor?.label || '',
                          COLOR_HEX: hex,
                        };
                      });
                      field.onChange(updatedColors);
                    }}
                    data={productColorOptions}
                    renderOption={renderMultiSelectOption}
                    hidePickedOptions
                  />
                )}
              />
              <Controller
                name="PRODUCT_SIZES"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    label="Tamanhos"
                    value={(field.value || []).filter((size): size is string => !!size)}
                    onChange={(value) => field.onChange(value)}
                    data={productSizeOptions}
                    hidePickedOptions
                  />
                )}
              />
            </SimpleGrid>
            <Controller
              name='PRODUCT_DESCRIPTION'
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
            Criar produto
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
