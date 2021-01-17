import * as Yup from 'yup'

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email('The email is incorrect').required('This field is required'),
  password: Yup.string().min(6, 'Minimum 6 symbols').required('This field is required')
})

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, 'Maximum 50 characters').required('This field is required'),
  lastName: Yup.string().max(50, 'Maximum 50 characters').required('This field is required'),
  email: Yup.string().email('Invalid email').max(256, 'Maximum length 256').required('This field is required'),
  password: Yup.string().min(6, 'Minimum 6 symbols').required('This field is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('This field is required')
})

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('The email is incorrect').required('This field is required')
})

export const RestorePasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, 'required, min 6 symbols').required('required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('This field is required')
})
