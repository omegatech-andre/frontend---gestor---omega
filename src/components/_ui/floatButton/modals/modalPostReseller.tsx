import usePost from "@/hooks/usePost";
import { schemaReseller } from "@/schemas/revendedores/schemaReseller";
import ProviderTheme from "@/styles/providerTheme";
import { ResellerGetDetails, ResellerPostDetails } from "@/types/resellerDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ProviderNotification from "../../notification/providerNotification";
import { API_BASE_URL } from "@/utils/apiBaseUrl";

export default function ModalPostReseller() {
  const { data: session } = useSession();
  const { isDesktop } = ProviderTheme();
  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaReseller),
    defaultValues: {
      RESELLER_STATE: "AC",
    },
  });

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<ResellerPostDetails, ResellerGetDetails>(`${API_BASE_URL}/resellers/create`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao criar revendedor',
        message: error.response?.status === 409 ? 'Você está cadastrando um revendedor que já existe.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Revendedor criado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);

  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Sucesso</Text>
        <Text ta='center' c='dimmed'>O revendedor foi criado com sucesso.</Text>
      </Stack>
    );
  }

  return (
    <Stack w='80vw' p={isDesktop ? '20' : 0}>
      <Stack gap={0}>
        <Text size="xl" ta='center'>Adicionar novo revendedor</Text>
        <Text size="sm" c='dimmed' ta='center'>Preencha os campos abaixo</Text>
      </Stack>
      <form onSubmit={handleSubmit(sendRequest)}>
        <Stack gap={30}>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Controller
              name='RESELLER_SOCIAL_NAME'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Razão Social'
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_CNPJ'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='CNPJ'
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_FANTASY_NAME'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Nome Fantasia'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_EMAIL'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Email'
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_PHONE1'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Telefone Principal'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_PHONE2'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Telefone adicional'
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_ZIP_CODE'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='CEP'
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_STATE'
              control={control}
              render={({ field }) => <Select
                {...field}
                label='Estado'
                required
                data={[
                  { value: "AC", label: "Acre" },
                  { value: "AL", label: "Alagoas" },
                  { value: "AP", label: "Amapá" },
                  { value: "AM", label: "Amazonas" },
                  { value: "BA", label: "Bahia" },
                  { value: "CE", label: "Ceará" },
                  { value: "DF", label: "Distrito Federal" },
                  { value: "ES", label: "Espírito Santo" },
                  { value: "GO", label: "Goiás" },
                  { value: "MA", label: "Maranhão" },
                  { value: "MT", label: "Mato Grosso" },
                  { value: "MS", label: "Mato Grosso do Sul" },
                  { value: "MG", label: "Minas Gerais" },
                  { value: "PA", label: "Pará" },
                  { value: "PB", label: "Paraíba" },
                  { value: "PR", label: "Paraná" },
                  { value: "PE", label: "Pernambuco" },
                  { value: "PI", label: "Piauí" },
                  { value: "RJ", label: "Rio de Janeiro" },
                  { value: "RN", label: "Rio Grande do Norte" },
                  { value: "RS", label: "Rio Grande do Sul" },
                  { value: "RO", label: "Rondônia" },
                  { value: "RR", label: "Roraima" },
                  { value: "SC", label: "Santa Catarina" },
                  { value: "SP", label: "São Paulo" },
                  { value: "SE", label: "Sergipe" },
                  { value: "TO", label: "Tocantins" },
                ]}
                value={field.value || ""}
                onChange={(value) => field.onChange(value || "")}
              />}
            />
            <Controller
              name='RESELLER_CITY'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Cidade'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_DISTRICT'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Bairro'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_STREET'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Rua'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
            <Controller
              name='RESELLER_NUMBER'
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Número'
                  required
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                />
              )}
            />
          </SimpleGrid>
          <Button
            type='submit'
            fullWidth
            loading={isPosting}
          >
            Criar revendedor
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
