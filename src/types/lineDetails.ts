import { FileWithPath } from "@mantine/dropzone"

export interface LineGetDetails {
  _id: string;
  LINE_NAME: string;
  LINE_DESCRIPTION: string;
  LINE_URL_IMAGE: String;
  LINE_STATUS: 'PENDING' | 'APPROVED' | 'DISABLED';
  LINE_CATEGORIES: string[];
  createdAt: string;
}

export interface LinePostDetails {
  LINE_NAME?: string;
  LINE_DESCRIPTION?: string;
  LINE_STATUS?: 'PENDING' | 'APPROVED' | 'DISABLED';
}

export interface LinePostImage {
  LINE_URL_IMAGE?: FileWithPath;
}
