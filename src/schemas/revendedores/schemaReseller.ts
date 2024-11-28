import * as yup from 'yup'

export const schemaReseller = yup.object().shape({
  _id: yup
    .string()
    .optional(),
  RESELLER_CNPJ: yup
    .string()
    .optional(),
  RESELLER_SOCIAL_NAME: yup
    .string()
    .optional(),
  RESELLER_FANTASY_NAME: yup
    .string()
    .optional(),
  RESELLER_EMAIL: yup
    .string()
    .optional(),
  RESELLER_ZIP_CODE: yup
    .string()
    .optional(),
  RESELLER_STATE: yup
    .string()
    .optional(),
  RESELLER_CITY: yup
    .string()
    .optional(),
  RESELLER_DISTRICT: yup
    .string()
    .optional(),
  RESELLER_STREET: yup
    .string()
    .optional(),
  RESELLER_NUMBER: yup
    .string()
    .optional(),
  RESELLER_PHONE1: yup
    .string()
    .optional(),
  RESELLER_PHONE2: yup
    .string()
    .optional(),
  RESELLER_STATUS: yup
    .string()
    .oneOf(['PENDING', 'APPROVED', 'DISABLED'])
    .optional(),
  RESELLER_URL_LOGO: yup
    .string()
    .optional()
});
