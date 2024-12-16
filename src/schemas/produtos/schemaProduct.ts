import * as yup from 'yup';

export const schemaProduct = yup.object().shape({
  PRODUCT_NAME: yup
    .string()
    .optional(),
  PRODUCT_DESCRIPTION: yup
    .string()
    .optional(),
  PRODUCT_FISPQ: yup
    .string()
    .optional(),
  PRODUCT_BOLETIM: yup
    .string()
    .optional(),
  PRODUCT_URL_IMAGES: yup
    .array().of(yup.string())
    .optional(),
  PRODUCT_TAGS: yup
    .array().of(yup.string())
    .optional(),
  PRODUCT_COLORS: yup
    .array().of(
      yup.object().shape({
        COLOR_NAME: yup
          .string()
          .optional(),
        COLOR_HEX: yup
          .string()
          .optional(),
      })
    )
    .optional(),
  PRODUCT_SIZES: yup
    .array().of(yup.string())
    .optional(),
  PRODUCT_STATUS: yup
    .string()
    .oneOf(['PENDING', 'APPROVED', 'DISABLED'])
    .optional(),
  FK_PRODUCT_CATEGORY: yup
    .string()
    .optional()
})
