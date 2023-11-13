// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import * as yup from 'yup'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import { instanceApiSolutoriaAuth } from 'src/axios';
import { IFormInputs } from './interface';
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: '0',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '100rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '100rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const LogoIllustrationWrapper = styled(Box)<BoxProps>(() => ({
  padding: '0',
  flex: '1',
  flexDirection: 'column',
  justifyContent: 'center'
}))

const LogoIllustration = styled('img')(({ theme }) => ({
  maxWidth: '26rem',

  [theme.breakpoints.down('xl')]: {
    maxWidth: '25rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '20rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const schema = yup.object().shape({
  password: yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(64, 'Máximo 64 caracteres')
    .matches(/(?=.*\d)/, 'Debe contener al menos un número')
    .matches(/(?=.*[a-z])/, 'Debe contener al menos una letra minúscula')
    .matches(/(?=.*[A-Z])/, 'Debe contener al menos una letra mayúscula')
    .matches(/(?=.*[-+_!@#$%^&*.,;:?"/()=?¿'])/, 'Debe contener al menos un carácter especial')
    .matches(/^(?!.*abc).*$/, 'No secuencias fáciles: abc')
    .matches(/^(?!.*123).*$/, 'No secuencias fáciles: 123')
    .required('Contraseña es requerida')
    .typeError('Contraseña inválida'),
  confirmPassword: yup.string()
    .nullable()
    .oneOf([yup.ref('password'), null], 'Contraseñas no coinciden')
})

const defaultValues = {
  password: '',
  confirmPassword: '',
}

export const CtrlCardChangePassword = () => {
  const [cargando, setCargando] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const router = useRouter()

  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const validarToken = async () => {
    try {
      setCargando(true)
      if (router.query.token != null){
        const { data }: any = await instanceApiSolutoriaAuth.post('/Password/VerificarToken',
        {
          Token:''+router.query.token,
        }

        )
        if(!data.Data){
          Swal.fire({
            title: `El Token de Recuperación no es valido`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0098aa'
          })
        }
      }else{
        Swal.fire({
          title: `No Existe Token de autorizacion en la URL`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0098aa'
        })
      }
    } catch (error: any) {
      console.log('Descripción error:', error)
    } finally {
      setCargando(false)
    }
  }

  const onSubmit = async (data: IFormInputs) => {
    setCargando(true)
    const { password } = data
    try {
      setCargando(true)
      const body = {
        Password: password,
        Token:router.query.token,
      }
      const {data : infoChangePassword} = await instanceApiSolutoriaAuth.post(`/Password/CambioClave`, body)

      if(infoChangePassword.Data != null && infoChangePassword.Information.StatusCode == 200){
        Swal.fire({
          title: `Se Cambio Correctamente la Contraseña`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0098aa'
        }).then((result: any) => {
          if (result.isConfirmed) {
            router.push('/login')
          }
        })
      }else{
        Swal.fire({
          title: `Falló. vuelva a intentarlo`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0098aa'
        })
      }

    } catch (error: any) {
      console.log('Descripción error:', error)
    } finally {
      setCargando(false)
    }
  }

  return {
    LoginIllustrationWrapper,
    LoginIllustration,
    LogoIllustrationWrapper,
    LogoIllustration,
    RightWrapper,
    BoxWrapper,
    schema,
    defaultValues,
    cargando,
    showPassword,
    showConfirmPassword,
    hidden,
    skin,
    theme,
    router,
    setShowPassword,
    setShowConfirmPassword,
    onSubmit,
    validarToken
  }
}
