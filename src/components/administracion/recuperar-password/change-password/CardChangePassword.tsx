/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Head from 'next/head'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { InputLabel, OutlinedInput } from '@mui/material'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { CtrlCardChangePassword } from './CtrlCardChangePassword'

export const CardChangePassword = () => {
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
  } = CtrlCardChangePassword()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (router.isReady){
      validarToken()
    }
  }, [router.isReady])

  return (
    <>
      <Head>
        <title>Cambiar contraseña</title>
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
                <Typography variant='h5' sx={{ mb: 2 }}>
                  Cambiar contraseña
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  A continuación, ingrese su nueva contraseña:
                </Typography>
                <Typography variant='body2' sx={{ mb: 4 }}>
                  La contraseña debe tener entre 8 y 64 caracteres, contener números, por lo menos una letra minúscula,
                  una letra mayúscula, y algún carácter especial.
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                    Nueva contraseña
                  </InputLabel>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='Contraseña'
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                    Repita su contraseña
                  </InputLabel>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='Contraseña'
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.confirmPassword)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.confirmPassword.message}
                    </FormHelperText>
                  )}
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
                  disabled={cargando}
                >
                  {cargando ? <CircularProgress sx={{ color: '#fff' }} /> : 'Cambiar contraseña'}
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
