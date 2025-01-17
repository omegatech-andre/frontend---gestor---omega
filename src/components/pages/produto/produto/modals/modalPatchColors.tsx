import { productColorOptions } from "@/utils/productColorOptions";
import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePatch from "@/hooks/usePatch";
import { schemaProduct } from "@/schemas/produtos/schemaProduct";
import { ProductGetDetails, ProductPostDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, ColorSwatch, Group, MultiSelect, MultiSelectProps, Stack, Text } from "@mantine/core";
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

const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => (
  <Group>
    <ColorSwatch radius={10} size={16} color={option.value} />
    {option.label}
  </Group>
);

export default function ModalPatchColors({ product, inputLabel, inputValue, inputField }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm<ProductPostDetails>({
    mode: "onChange",
    resolver: yupResolver(schemaProduct),
    defaultValues: {
      [inputField as keyof ProductPostDetails]: inputValue,
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<ProductPostDetails, ProductGetDetails>(`${API_BASE_URL}/products/update/${product.PRODUCT_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

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
          <Text ta='center' size="sm" c='dimmed'>Selecione as cores a baixo</Text>
        </Stack>
        <Controller
          name="PRODUCT_COLORS"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
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
