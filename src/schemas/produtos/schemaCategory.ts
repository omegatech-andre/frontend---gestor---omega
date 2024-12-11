import * as yup from 'yup';

export const schemaCategory = yup.object().shape({
  CATEGORY_NAME: yup
    .string()
    .optional(),
  CATEGORY_DESCRIPTION: yup
    .string()
    .optional(),
  CATEGORY_STATUS: yup
    .string()
    .oneOf(['PENDING', 'APPROVED', 'DISABLED'])
    .optional(),
  FK_CATEGORY_LINE: yup
    .string()
    .optional(),
})
