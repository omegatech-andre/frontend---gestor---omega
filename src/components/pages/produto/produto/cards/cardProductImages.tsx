import { ProductGetDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { ActionIcon, AspectRatio, Flex, Image, Modal, Overlay, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import ModalViewImages from "../modals/modalViewImages";
import ModalPatchImage from "../modals/modalPatchImage";

interface Props {
  product: ProductGetDetails;
}

export default function CardProductImages({ product }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'view' | 'delete' | ''>('');
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleOpenModal = (image: string, content: 'view' | 'delete') => {
    setSelectedImage(image)
    setModalContent(content)
    open();
  };

  return (
    <>
      <Flex gap={"lg"} my={"lg"} align={"center"}>
        {product.PRODUCT_URL_IMAGES.map((image, index) => (
          <AspectRatio
            key={index}
            pos={"relative"}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image src={`${API_BASE_URL}${image}`} w={110} h={110} alt="imagem do produto" />
            {hoveredIndex === index && (
              <Overlay opacity={1}>
                <Flex justify="center" align="center" h="100%" gap={"xs"}>
                  <Tooltip label="Ver imagem" position="bottom">
                    <ActionIcon onClick={() => handleOpenModal(image, "view")} variant="filled" size="lg">
                      <IconEye size={20} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Apagar imagem" position="bottom">
                    <ActionIcon onClick={() => handleOpenModal(image, "delete")} variant="filled" size="lg">
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </Overlay>
            )}
          </AspectRatio>
        ))}
        <Tooltip label="Adicionar imagem" position="bottom">
          <ActionIcon bg={"red"} radius={50} size={50} onClick={() => console.log("Adicionar imagem")} variant="default" aria-label={"Adicionar imagem"}>
            <IconEdit size={20} />
          </ActionIcon>
        </Tooltip>
      </Flex>
      <Modal
        opened={opened}
        size={'auto'}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
      >
        {modalContent === 'view' && <ModalViewImages image={selectedImage} />}
        {modalContent === 'delete' && <ModalPatchImage product={product} image={selectedImage} />}
      </Modal>
    </>
  );
}
