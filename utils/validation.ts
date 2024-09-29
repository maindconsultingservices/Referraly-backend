import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  gender: yup.string(),
  phoneNumber: yup.string(),
  dateOfBirth: yup.date(),
  address: yup.string(),
  languagePreference: yup.string().oneOf(['en', 'es']).required(),
});
