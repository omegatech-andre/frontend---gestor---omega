import * as yup from 'yup';

export const schemaLine = yup.object().shape({
  LINE_NAME: yup
    .string()
    .optional(),
  LINE_DESCRIPTION: yup
    .string()
    .optional(),
  LINE_URL_IMAGE: yup
    .string()
    .optional(),
  LINE_STATUS: yup
    .string()
    .oneOf(['PENDING', 'APPROVED', 'DISABLED'])
    .optional(),
})
