import { Button, Group, Image, Stack, Text } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconDownload, IconPhotoUp, IconRefresh, IconTrash, IconX } from "@tabler/icons-react";
import { useRef } from "react";

interface Props {
  fileType: "image/webp" | "application/pdf";
  name: string;
  width?: string;
  hight?: string;
  size: string;
  files: FileWithPath[];
  setFiles: (files: FileWithPath[]) => void;
}

export default function DropzonePicture({ fileType, name, width, hight, size, files, setFiles }: Props) {
  const openRef = useRef<() => void>(() => { });

  const handleRemove = () => {
    setFiles([]);
  };

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Group key={index}>
        {
          fileType === 'image/webp'
            ? <Image w={200} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
            : <Text fz={"sm"} ta={"center"}>{file.name}</Text>
        }
      </Group>
    );
  });

  return (
    <>
      {
        previews.length > 0
          ? <Stack align="center" p={20} pb={0}>
            {previews}
            {
              previews.length > 0
              && <Group justify="center" gap={0}>
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
            }
          </Stack>
          : <Dropzone
            px={15}
            py={30}
            style={{ cursor: 'pointer' }}
            openRef={openRef}
            onDrop={setFiles}
            radius="md"
            accept={[fileType]}
            maxSize={
              fileType === 'application/pdf'
                ? 5 * 1024 ** 2
                : fileType === 'image/webp'
                  ? 500 * 1024
                  : 50 * 1024
            }
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
              <Dropzone.Reject>O arquivo não um {fileType === 'image/webp' ? "WEBP" : "PDF"} ou é maior que {size}</Dropzone.Reject>
              <Dropzone.Idle>Carregar {name}</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Clique ou arraste e solte o arquivo aqui para fazer o carregamento. Só é permitido arquivo {fileType === 'image/webp' ? "WEBP" : "PDF"} com menos de {size}
            </Text>
            {
              fileType === 'image/webp'
              && <Text ta="center" fz="sm" mt="xs" c="dimmed">
                Obs: para manter um padrão envie imagens com dimensão de {width}x{hight} pixels
              </Text>
            }
          </Dropzone>
      }
    </>
  );
}
