import * as yup from 'yup';
import { campoRequeridoYup, campoSinEspacios, celularRequeridoYup, emailRequeridoYup, telefonoRequeridoYup } from './yupText'

const regexValidateEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/
const regexStringSinEspacios = /^(?!\s)[\w\s-áéíóú]*$/


export const stringRequired = yup.string().required(campoRequeridoYup)
export const stringRequiredSinEspacios = yup.string().required(campoRequeridoYup).matches(regexStringSinEspacios, campoSinEspacios)
export const stringNotRequired = yup.string().notRequired()
export const booleanRequired = yup.boolean().required(campoRequeridoYup)
export const booleanNotRequired = yup.boolean().notRequired()
export const numberRequired = yup.number().required(campoRequeridoYup)
export const emailRequired = yup.string().required(campoRequeridoYup).email(emailRequeridoYup).matches(regexValidateEmail,emailRequeridoYup)
export const emailNotRequired = yup.string().email(emailRequeridoYup).matches(regexValidateEmail,emailRequeridoYup).notRequired()
export const telefonoRequired = yup.string().required(campoRequeridoYup).min(8, telefonoRequeridoYup)
export const celularRequired = yup.string().required(campoRequeridoYup).min(9, celularRequeridoYup)