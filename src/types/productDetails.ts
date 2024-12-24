import { FileWithPath } from "@mantine/dropzone";

export interface ProductGetDetails {
  id: string;
  PRODUCT_NAME: string;
  PRODUCT_DESCRIPTION: string;
  PRODUCT_FISPQ: string;
  PRODUCT_BOLETIM: string;
  PRODUCT_URL_IMAGES: string[];
  PRODUCT_TAGS: string[];
  PRODUCT_COLORS: {
    COLOR_NAME: string;
    COLOR_HEX: string;
  }[];
  PRODUCT_SIZES: string[];
  PRODUCT_STATUS: 'PENDING' | 'APPROVED' | 'DISABLED';
  PRODUCT_CATEGORY: {
    CATEGORY_NAME: string;
    CATEGORY_LINE: {
      LINE_NAME: string;
    };
  };
  createdAt: string;
}

export interface ProductPostDetails {
  PRODUCT_NAME?: string;
  PRODUCT_DESCRIPTION?: string;
  PRODUCT_FISPQ?: string;
  PRODUCT_BOLETIM?: string;
  PRODUCT_URL_IMAGES?: string[];
  PRODUCT_TAGS?: string[];
  PRODUCT_COLORS?: {
    COLOR_NAME?: string;
    COLOR_HEX?: string;
  }[];
  PRODUCT_SIZES?: string[];
  PRODUCT_STATUS?: 'PENDING' | 'APPROVED' | 'DISABLED';
  FK_PRODUCT_CATEGORY?: string;
}

export interface ProductPostFile {
  PRODUCT_FISPQ?: FileWithPath;
  PRODUCT_BOLETIM?: FileWithPath;
  PRODUCT_URL_IMAGES?: FileWithPath;
}
