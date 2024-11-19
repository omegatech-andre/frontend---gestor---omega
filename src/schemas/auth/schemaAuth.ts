import * as yup from 'yup'

export const schemaAuth = yup.object().shape({
  USER_NAME: yup
    .string()
    .required('Obrigatório'),
  USER_PASSWORD: yup
    .string()
    .required('Obrigatório')
});
