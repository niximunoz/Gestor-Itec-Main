// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Head from 'next/head'
import { CtrlCardRecoveryEmailPassword } from './CtrlCardRecoveryEmailPassword'

export const CardRecoveryEmailPassword = () => {
  const {
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
  } = CtrlCardRecoveryEmailPassword()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  return (
    <>
      <Head>
        <title>¿ Olvidó su contraseña?</title>
        <meta name='description' content='Ingreso' />
      </Head>

      <Box className='content-right'>
        {!hidden ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(to bottom,rgba(0,153,170,1) 0%,rgba(0,153,170,1) 85%,rgba(178,237,243,1) 100%)'
            }}
          >
            <LoginIllustrationWrapper>
              <LoginIllustration sx={{ p: '0' }} alt='logo_left' src={'/images/auth/logo_left.png'} />
            </LoginIllustrationWrapper>
            <FooterIllustrationsV2 />
          </Box>
        ) : null}
        <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
          <Box
            sx={{
              p: 7,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <BoxWrapper>
              <Box sx={{ mb: 2 }}>
                <LogoIllustrationWrapper sx={{ mb: 6 }}>
                  <LogoIllustration src={'/images/ISALUD.svg'} alt='logo_isalud' />
                </LogoIllustrationWrapper>
                <Typography variant='h5'>Olvidó su contraseña?</Typography>
                <Typography variant='body2'>
                  Ingrese su email y le enviaremos instrucciones para crear una nueva contraseña:
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        onFocus={onFocusInit}
                        error={Boolean(errors.email)}
                        placeholder='@isapredecodelco.cl'
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{
                    mb: 7,
                    '&:hover': {
                      borderColor: '#D37403',
                      background: '#D06732'
                    },
                    '&:disabled': {
                      backgroundColor: '#D06732'
                    }
                  }}
                  disabled={cargando ? true : false}
                >
                  {cargando ? <CircularProgress sx={{ color: '#fff' }} /> : 'Enviar Solicitud'}
                </Button>
                <Link passHref href='/login'>
                  <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main' }}>
                    Volver al inicio
                  </Typography>
                </Link>
              </form>
            </BoxWrapper>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}

CardRecoveryEmailPassword.guestGuard = true
CardRecoveryEmailPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
