import * as yup from 'yup'

export const schemaUser = yup.object().shape({
  USER_NAME: yup
    .string()
    .optional(),
  USER_PASSWORD: yup
    .string()
    .optional(),
  USER_AUTHORIZED: yup
    .boolean()
    .optional(),
  USER_ROLE: yup
    .string()
    .oneOf(['ADMIN', 'USER'])
    .optional(),
});
