import { API_BASE_URL } from "@/utils/apiBaseUrl";

interface Props {
  image: string;
}

export default function ModalViewImages({ image }: Props) {
  return <img width={'720px'} style={{ maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain" }} src={`${API_BASE_URL}${image}`} alt="produto-imagem" />
}
