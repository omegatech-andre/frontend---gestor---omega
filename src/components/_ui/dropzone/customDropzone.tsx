import { Button, Group, Image, Stack, Text } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconDownload, IconPhotoUp, IconRefresh, IconTrash, IconX } from "@tabler/icons-react";
import { useRef } from "react";

interface Props {
  name: string
  w: string
  h: string
  files: FileWithPath[]
  setFiles: (files: FileWithPath[]) => void
}

export default function CustomDropZone({ name, w, h, files, setFiles }: Props) {
  const openRef = useRef<() => void>(() => {});

  const handleRemove = () => {
    setFiles([]);
  };

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Image key={index} w={200} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  });

  return (
    <>
      {previews.length > 0 ? (
        <Stack align="center" p={20} pb={0}>
          {previews}
          {previews.length > 0 && (
            <Group justify="center" gap={0}>
              <Button
                onClick={handleRemove}
                type="button"
                variant="transparent"
                c='red'
                leftSection={<IconTrash size={20} />}
                >
                Remover {name}
              </Button>
              <Button
                onClick={() => openRef.current?.()}
                type="button"
                variant="transparent"
                c='red'
                leftSection={<IconRefresh size={20} />}
              >
                Trocar {name}
              </Button>
            </Group>
          )}
        </Stack>
      ) : (
        <Dropzone
          px={15}
          py={30}
          style={{ cursor: 'pointer' }}
          openRef={openRef}
          onDrop={setFiles}
          radius="md"
          accept={['image/webp']}
          maxSize={5 * 1024 ** 2}
        >
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload size={20} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={20} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhotoUp size={20} />
            </Dropzone.Idle>
          </Group>
          <Text ta="center" fw={700} fz="lg">
            <Dropzone.Accept>Soltar</Dropzone.Accept>
            <Dropzone.Reject>O arquivo não um PNG ou é maior que 5Mb</Dropzone.Reject>
            <Dropzone.Idle>Carregar {name}</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Clique ou arraste e solte o arquivo aqui para fazer o carregamento. Só é permitido arquivo PNG com menos de 5Mb
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Obs: para manter um padrão envie imagens com dimensão de {w}x{h} pixels
          </Text>
        </Dropzone>
      )}
    </>
  );
}
