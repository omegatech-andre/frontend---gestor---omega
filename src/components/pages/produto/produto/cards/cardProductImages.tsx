import { ProductGetDetails } from "@/types/productDetails";
import { API_BASE_URL } from "@/utils/apiBaseUrl";
import { ActionIcon, AspectRatio, Flex, Image, Modal, Overlay, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import ModalViewImages from "../modals/modalViewImages";
import ModalPatchImage from "../modals/modalPatchImage";
import { useSession } from "next-auth/react";

interface Props {
  product: ProductGetDetails;
}

export default function CardProductImages({ product }: Props) {
  const { data: session } = useSession();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [modalContent, setModalContent] = useState<| 'view' | 'delete' | ''>('');

  const handleOpenModal = (image: string, content: 'view' | 'delete') => {
    setSelectedImage(image)
    setModalContent(content)
    open();
  };

  return (
    <>
      <Flex gap={"md"} mt={"40"} align={"center"} wrap={"wrap"}>
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
                  {session?.user.USER_ROLE === "ADMIN" && (
                    <Tooltip label="Apagar imagem" position="bottom">
                      <ActionIcon onClick={() => handleOpenModal(image, "delete")} variant="filled" size="lg">
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Flex>
              </Overlay>
            )}
          </AspectRatio>
        ))}
      </Flex>
      <Modal
        opened={opened}
        size={'auto'}
        onClose={close}
        withCloseButton={modalContent === "delete"}
        closeOnClickOutside={modalContent === "view"}
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
