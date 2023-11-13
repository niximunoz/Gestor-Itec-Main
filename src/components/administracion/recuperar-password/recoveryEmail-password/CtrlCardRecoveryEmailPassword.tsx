// ** React Imports
import { useState } from 'react'

import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import * as yup from 'yup'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

import { instanceApiSolutoriaAuth } from 'src/axios'
import { IFormInput } from './interface'
import Swal from 'sweetalert2'
import { emailRequired } from 'src/helpers'

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
  email: emailRequired
})

const defaultValues = {
  email: '@isapredecodelco.cl'
}

export const CtrlCardRecoveryEmailPassword = () => {
  const [cargando, setCargando] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()

  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const onSubmit = async (data: IFormInput) => {
    setCargando(true)
    const { email } = data
    try {
      setCargando(true)
      const body = {
        Email: email,
        Tipo: 1,
        Ambiente: window.location.origin
      }

      const {data : infoEmail} = await instanceApiSolutoriaAuth.post(`/Password/EnviarCorreoClave`, body)

      if(infoEmail.Data && infoEmail.Information.StatusCode == 200){
        Swal.fire({
            title: `El Email se envio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0098aa'
        })
      }else{
        Swal.fire({
            title: `Falló el envio del Email`,
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

  const onFocusInit = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.currentTarget.selectionStart = 0
    e.currentTarget.selectionEnd = 0
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
    hidden,
    skin,
    theme,
    onSubmit,
    onFocusInit
  }
}
