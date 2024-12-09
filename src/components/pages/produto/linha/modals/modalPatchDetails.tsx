import ProviderNotification from "@/components/_ui/notification/providerNotification";
import usePatch from "@/hooks/usePatch";
import { schemaLine } from "@/schemas/produtos/schemaLine";
import { LineGetDetails, LinePostDetails } from "@/types/lineDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  line: LineGetDetails;
  inputLabel: string;
  inputValue: string;
  inputField: keyof LinePostDetails;
}

export default function ModalPatchDetails({ line, inputLabel, inputValue, inputField }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, watch } = useForm<LinePostDetails>({
    mode: "onChange",
    resolver: yupResolver(schemaLine),
    defaultValues: {
      [inputField]: inputValue,
    },
  });

  const watchData = watch();
  const { isUpdating, response, error, sendRequest } = usePatch<LinePostDetails, LineGetDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/lines/update/${line.LINE_NAME}`, watchData, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });

  useEffect(() => {
    if (error) {
      ProviderNotification({
        title: error.response?.status === 409 ? 'Erro de confilto' : 'Erro ao editar linha',
        message: error.response?.status === 409 ? 'Você está tantando usar informações cadastradas em outra linha.' : 'Tente novamente mais tarde.',
      });
    }
    if (response) {
      ProviderNotification({
        title: 'Sucesso',
        message: 'Linha editada com sucesso!',
        reload: true,
      });
    }
  }, [response, error]);


  if (response) {
    return (
      <Stack align="center" gap={0}>
        <IconCircleCheckFilled color="green" size={100} />
        <Text ta='center'>Linha atualizada</Text>
        <Text ta='center' c='dimmed'>As Informações da linha foram atualizadas com sucesso!</Text>
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
        {inputField === "LINE_DESCRIPTION" ? (
          <Controller
            name="LINE_DESCRIPTION"
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
