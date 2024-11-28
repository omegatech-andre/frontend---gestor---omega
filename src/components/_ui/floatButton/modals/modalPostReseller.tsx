import usePost from "@/hooks/usePost";
import { schemaReseller } from "@/schemas/revendedores/schemaReseller";
import ProviderTheme from "@/styles/providerTheme";
import { ResellerGetDetails, ResellerPostDetails } from "@/types/resellerDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Paper, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ModalPostReseller() {
  const { data: session } = useSession();
  const { register, handleSubmit, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaReseller)
  });
  const { isDesktop } = ProviderTheme();
  const [inputValue, setInputValue] = useState<string>("");

  const watchData = watch();
  const { isPosting, response, error, sendRequest } = usePost<ResellerPostDetails, ResellerGetDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/reseller/create`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

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
      <form onSubmit={handleSubmit(() => console.log(watchData))}>
        <Stack gap={30}>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextInput
              {...register('RESELLER_SOCIAL_NAME')}
              label='Razão Social'
            />
            <TextInput
              {...register('RESELLER_CNPJ')}
              label='CNPJ'
            />
            <TextInput
              {...register('RESELLER_FANTASY_NAME')}
              label='Nome Fantasia'
              required
            />
            <TextInput
              {...register('RESELLER_EMAIL')}
              label='Email'
            />
            <TextInput
              {...register('RESELLER_PHONE1')}
              label='Telefone Principal'
              required
            />
            <TextInput
              {...register('RESELLER_PHONE2')}
              label='Telefone adicional'
            />
            <TextInput
              {...register('RESELLER_ZIP_CODE')}
              label='CEP'
            />
            <Select
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
              value={inputValue}
              onChange={(value) => setInputValue(value || "")}
            />
            <TextInput
              {...register('RESELLER_CITY')}
              label='Cidade'
              required
            />
            <TextInput
              {...register('RESELLER_DISTRICT')}
              label='Bairro'
              required
            />
            <TextInput
              {...register('RESELLER_STREET')}
              label='Rua'
              required
            />
            <TextInput
              {...register('RESELLER_NUMBER')}
              label='Número'
              required
            />
          </SimpleGrid>
          <Button
            type='submit'
            fullWidth
            loading={isPosting}
          >
            Salvar
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}