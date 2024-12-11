import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePatch from "@/hooks/usePatch";
import { schemaReseller } from "@/schemas/revendedores/schemaReseller";
import { ResellerGetDetails, ResellerPostDetails } from "@/types/resellerDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Select, Stack, Text, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  reseller: ResellerGetDetails;
  inputLabel: string;
  inputValue: string;
  inputField: keyof ResellerPostDetails;
}

export default function ModalPatchDetails({ reseller, inputLabel, inputValue, inputField }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm<ResellerPostDetails>({
    mode: "onChange",
    resolver: yupResolver(schemaReseller),
    defaultValues: {
      [inputField]: inputValue,
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<ResellerPostDetails, ResellerGetDetails>(`${API_BASE_URL}/resellers/update/${reseller.RESELLER_FANTASY_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao editar revendedor',
        message: error.response?.status === 409 ? 'Você está tantando usar informações cadastradas em outro revendedor.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Revendedor editado com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);


  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Revendedor atualizado</Text>
        <Text ta='center' c='dimmed'>As Informações do revendedor foram atualizadas com sucesso!</Text>
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
        {inputField === "RESELLER_STATE" ? (
          <Controller
            name="RESELLER_STATE"
            control={control}
            render={({ field }) => <Select
              {...field}
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
              value={field.value || inputValue}
              onChange={(value) => field.onChange(value || "")}
            />}
          />
        ) : (
          <Controller
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
        )}
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
