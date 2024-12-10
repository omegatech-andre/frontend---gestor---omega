export interface CategoryGetDetails {
  id: string;
  CATEGORY_NAME: string;
  CATEGORY_DESCRIPTION: string;
  CATEGORY_STATUS: 'PENDING' | 'APPROVED' | 'DISABLED';
  CATEGORY_PRODUCTS: [];
  CATEGORY_LINE: {
    LINE_NAME: string;
  };
  createdAt: string;
}

export interface CategoryPostDetails {
  CATEGORY_NAME?: string;
  CATEGORY_DESCRIPTION?: string;
  CATEGORY_STATUS?: 'PENDING' | 'APPROVED' | 'DISABLED';
  FK_CATEGORY_LINE?: string;
}
