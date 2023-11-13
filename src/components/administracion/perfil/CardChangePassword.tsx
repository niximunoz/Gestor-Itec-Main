// ** React Imports
import {useState} from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Custom Components Imports
import * as yup from 'yup'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {Card, CardHeader, FormHelperText, Tooltip} from '@mui/material'
import Swal from 'sweetalert2'
import UserSpinner from 'src/layouts/components/UserSpinner'
import {SaveAs} from '@mui/icons-material'
import {encryptText} from 'src/helpers'
import { instanceMiddlewareApi } from 'src/axios'
import { useAuth } from 'src/hooks/useAuth'
import { ITblUsuario } from 'src/interfaces'

interface FormData {
  password: string
  confirmPassword: string
}

const schema = yup.object().shape({
  password: yup
    .string()
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
  confirmPassword: yup.string().nullable().oneOf([yup.ref('password'), null], 'Contraseñas no coinciden')
})

const defaultValues = {
  password: '',
  confirmPassword: ''
}

type Props = {
  usuario : ITblUsuario | null
}

const CardChangePassword = ({usuario} : Props) => {
  // ** States
  const {logout} = useAuth()
  const [cargando, setCargando] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setCargando(true)
    try {
      const newPasswordEncrypt = data.password == data.confirmPassword ? encryptText(data.password) : null
      const newRutEncrypt = encryptText(usuario?.UsuDvRut.toString() ?? '0')

      if (newPasswordEncrypt && newPasswordEncrypt != null) {
        const body = {
          NewPassword: newPasswordEncrypt,
          RutUsuario: newRutEncrypt
        }

        const response: any = await instanceMiddlewareApi.post(`/Usuarios/UpdatePasswordUser/`, body)

        if (response.data.Data != null && response.data.Data && response.status == 200) {
          Swal.fire({
            title: `La contraseña se actualizó exitosamente`,
            text: `Será redirigido al inicio`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0098aa'
          }).then((result: any) => {
            if (result.isConfirmed) {
              logout()
            }
          })
        } else {
          Swal.fire({
            title: `Error, Fallo la actualización`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0098aa'
          })
        }
      } else {
        Swal.fire({
          title: `Error, Fallo la actualización`,
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

  const onerrors: any = (errors: any, e: any) => console.log(errors, e)

  return (
    <Card>
      <CardHeader
        title={`Actualizar Contraseña del Usuario`}
        titleTypographyProps={{variant: 'h2'}}
        subheader='Contraseña Personal'
      />
      <CardContent sx={{height: '100%'}}>
        <Grid container spacing={5} sx={{height: '100%'}}>
          <Divider sx={{mb: 5, mt: 1}}/>
          <Grid item xs={12}>
            {cargando ? (
              <UserSpinner/>
            ) : (
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={12} sx={{mt: 5, mb: [0, 6]}}>
                      <Grid item xs={12} sx={{mb: 6}}>
                        <Controller
                          name='password'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange, onBlur}}) => (
                            <OutlinedInput
                              placeholder='Nueva contraseña'
                              value={value}
                              onBlur={onBlur}
                              fullWidth
                              error={Boolean(errors.password)}
                              type={showPassword ? 'text' : 'password'}
                              onChange={onChange}
                              endAdornment={
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOutline/> : <EyeOffOutline/>}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          )}
                        />
                        {errors.password && (
                          <FormHelperText sx={{color: 'error.main'}} id=''>
                            {errors.password.message}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} sx={{mb: 6}}>
                        <Controller
                          name='confirmPassword'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange, onBlur}}) => (
                            <OutlinedInput
                              placeholder='Repita su contraseña'
                              value={value}
                              onBlur={onBlur}
                              fullWidth
                              error={Boolean(errors.confirmPassword)}
                              type={showConfirmPassword ? 'text' : 'password'}
                              onChange={onChange}
                              endAdornment={
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? <EyeOutline/> : <EyeOffOutline/>}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          )}
                        />
                        {errors.confirmPassword && (
                          <FormHelperText sx={{color: 'error.main'}} id=''>
                            {errors.confirmPassword.message}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'right'}}>
                        <Tooltip title={'Actualizar Contraseña'} arrow>
                          <Button
                            variant='outlined'
                            sx={{mr: 2}}
                            color='info'
                            onClick={handleSubmit(onSubmit, onerrors)}
                            type='submit'
                            disabled={cargando}
                          >
                            <SaveAs sx={{mr: 1}}/>
                            Actualizar Contraseña
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </form>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
export default CardChangePassword
