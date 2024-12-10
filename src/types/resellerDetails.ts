import { FileWithPath } from "@mantine/dropzone"

export interface ResellerGetDetails {
  id: string;
  RESELLER_CNPJ: string;
  RESELLER_SOCIAL_NAME: string;
  RESELLER_FANTASY_NAME: string;
  RESELLER_EMAIL: string;
  RESELLER_ZIP_CODE: string;
  RESELLER_STATE: string;
  RESELLER_CITY: string;
  RESELLER_DISTRICT: string;
  RESELLER_STREET: string;
  RESELLER_NUMBER: string;
  RESELLER_PHONE1: string;
  RESELLER_PHONE2: string;
  RESELLER_STATUS: 'PENDING' | 'APPROVED' | 'DISABLED';
  RESELLER_URL_LOGO: string;
  createdAt: string;
}

export interface ResellerPostDetails {
  RESELLER_CNPJ?: string;
  RESELLER_SOCIAL_NAME?: string;
  RESELLER_FANTASY_NAME?: string;
  RESELLER_EMAIL?: string;
  RESELLER_ZIP_CODE?: string;
  RESELLER_STATE?: string;
  RESELLER_CITY?: string;
  RESELLER_DISTRICT?: string;
  RESELLER_STREET?: string;
  RESELLER_NUMBER?: string;
  RESELLER_PHONE1?: string;
  RESELLER_PHONE2?: string;
  RESELLER_STATUS?: 'PENDING' | 'APPROVED' | 'DISABLED';
}

export interface ResellerPostLogo {
  RESELLER_URL_LOGO?: FileWithPath;
}
