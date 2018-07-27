import * as yup from 'yup';

export const registerValidations = yup.object().shape({
    email: yup
        .string()
        .email('Email not valid')
        .required('Email is required'),
    password: yup
        .string()
        .min(4, 'Password has to be at least 4 characters long')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Password confirm is required')
});
