import * as yup from 'yup'

export const schemaSignup = yup.object().shape({
  USER_NAME: yup
    .string()
    .required('Obrigatório'),
  USER_PASSWORD: yup
    .string()
    .required('Obrigatório')
});
