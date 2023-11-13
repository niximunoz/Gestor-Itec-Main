/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, ElementType, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Autocomplete,
  Card,
  CardHeader,
  DialogActions,
  Divider,
  FormControlLabel,
  FormHelperText,
  Switch,
  Tooltip
} from '@mui/material'
import { booleanRequired, calculateRutVerificador, emailRequired, stringRequired } from 'src/helpers'
import { SaveAs } from '@mui/icons-material'
import UserSpinner from 'src/layouts/components/UserSpinner'
import Swal from 'sweetalert2'
import { instanceMiddlewareApi } from 'src/axios'
import { ITblRolesUsuario, ITblUsuario } from 'src/interfaces'
import { useAuth } from 'src/hooks/useAuth'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

interface IDocumentoAdjunto {
  NombreArchivo: string
  Base64Archivo: string
}

interface IFormInputs {
  UsuRut : string
  UsuDvRut : string
  UsuNombre : string
  UsuApellido : string
  UsuEmail : string
  UsuRol : string | null
  FechaModificacion : Date | null
  FechaCreacion : Date
  Activo : boolean
}

const schemaUsuario = yup.object({
  UsuRut: stringRequired,
  UsuDvRut: stringRequired,
  UsuNombre: stringRequired,
  UsuApellido: stringRequired,
  UsuEmail: emailRequired,
  UsuRol: stringRequired,
  Activo: booleanRequired
})

const defaultImages = [
  { src: '/images/avatars/1.png', name: '1.png' },
  { src: '/images/avatars/2.png', name: '2.png' },
  { src: '/images/avatars/3.png', name: '3.png' },
  { src: '/images/avatars/4.png', name: '4.png' },
  { src: '/images/avatars/5.png', name: '5.png' },
  { src: '/images/avatars/6.png', name: '6.png' },
  { src: '/images/avatars/7.png', name: '7.png' },
  { src: '/images/avatars/8.png', name: '8.png' }
]

type Props = {
  usuario : ITblUsuario | null
}

const CardPerfil = ({usuario} : Props) => {
  // ** State
  const auth = useAuth()
  const [cargando, setCargando] = useState<boolean>(true)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [base64Img, setBase64Img] = useState<IDocumentoAdjunto | null>(null)
  const [listadoRoles, setListadoRoles] = useState<ITblRolesUsuario[]>([])
  const [rolSeleccionado, setRolSeleccionado] = useState<ITblRolesUsuario | null>(null)

  const [isModalOpen, setModalOpen] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm<any>({
    resolver: yupResolver(schemaUsuario),
    mode: 'onChange'
  })

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      const reader = new FileReader()

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setImgSrc(e.target.result as string)
          const base64String = (e.target.result as string).split(',')[1]
          if (base64String && base64String != null) {
            const documento: IDocumentoAdjunto = {
              NombreArchivo: file.name,
              Base64Archivo: base64String
            }
            setBase64Img(documento)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const setDefaultImage = async (image: { src: string; name: string }) => {
    setImgSrc(image.src)

    const response = await fetch(image.src)
    const blob = await response.blob()

    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const base64String = (e.target.result as string).split(',')[1]
        if (base64String) {
          const documento: IDocumentoAdjunto = {
            NombreArchivo: image.name,
            Base64Archivo: base64String
          }
          setBase64Img(documento)
        }
      }
    }

    reader.readAsDataURL(blob)
  }

  const actualizarUsuario = async (data: IFormInputs) => {
    setCargando(true)
    try {
      const newUsuario = {
        UsuId: usuario?.UsuId,
        UsuRut: parseInt(data.UsuRut),
        UsuDvRut: data.UsuDvRut,
        UsuNombre: data.UsuNombre,
        UsuApellido: data.UsuApellido,
        UsuEmail: data.UsuEmail,
        UsuRol: data.UsuRol,
        FechaCreacion: usuario?.FechaCreacion,
        Activo: data.Activo
      }

      const { data: crearUsuario } = await instanceMiddlewareApi.post(
        '/Usuarios/ActualizarInformacionPersonalUsuario',
        newUsuario)
      if (crearUsuario.Information.StatusCode == 200) {
        if (crearUsuario.Data) {
          Swal.fire({
            title: `Usuario ${crearUsuario.Data.NombreUsu} ${crearUsuario.Data.ApellidoUsu} se actualizó exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0098aa'
          })
          if(auth.user && auth.user != null){
            const userDataStorage = JSON.parse(localStorage.getItem('userData')!)
            userDataStorage.foto = crearUsuario.Data.Foto
            localStorage.setItem('userData', JSON.stringify(userDataStorage))
            cargarUsuario(crearUsuario.Data)
          } 
        } else {
          Swal.fire({
            title: 'Error, fallo la actualizacion',
            text: `Error al actualizar a ${data.UsuNombre} ${data.UsuApellido}`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0098aa'
          })
        }
      } else {
        Swal.fire({
          title: 'Error, fallo la actualizacion',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0098aa'
        })
      }
    } catch (error) {
      console.error('Descripción error', error)
      Swal.fire({
        title: 'Error, vuelva a intentar',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0098aa'
      })
    } finally {
      setCargando(false)
    }
  }

  const cargarUsuario =  async (usuario: ITblUsuario | null) => {
    setCargando(true)
    try {
      if(usuario && usuario.UsuId > 0){
        const {data : ListadoRolUsuario} = await instanceMiddlewareApi.get('/Usuarios/ObtenerRolUsuarios')
        if(ListadoRolUsuario.Data){
          setListadoRoles(ListadoRolUsuario.Data ?? [])
          setRolSeleccionado(ListadoRolUsuario.Data.find((x : ITblRolesUsuario) => x.RolNombre == usuario.UsuRol))
        }
          
      }
    } catch (error) {
      console.error('Descripción error:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleChangeRol = (
    event: SyntheticEvent,
    newValue: ITblRolesUsuario | null) => {
        setValue('UsuRol', newValue?.RolNombre ?? '')
        setRolSeleccionado(newValue ?? null)
  }

  useEffect(() => {
      const inicializar = async () => {
        console.log(usuario)
        await cargarUsuario(usuario)
      }
      inicializar()
  }, [usuario])

  const onerrors: any = (errors: any, e: any) => console.log(errors, e)

  return (
    <Card>
      <CardHeader
        title={`Información Perfil Usuario`}
        titleTypographyProps={{ variant: 'h2' }}
        subheader='Información Personal'
      />
      <CardContent sx={{ height: '100%' }}>
        <Grid container spacing={5} sx={{ height: '100%' }}>
          <Divider sx={{ mb: 5, mt: 1 }} />
          <Grid item xs={12}>
            {cargando ? (
              <UserSpinner />
            ) : (
              <form>
                <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='UsuRut'
                    control={control}
                    defaultValue={usuario?.UsuRut.toString() ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Rut Usuario'
                        value={value}
                        onChange={e => {
                            const newValue = e.target.value.replace(/[^0-9]/g, '')
                            onChange(newValue)
                            setValue('UsuRut', newValue)
                            if (newValue.length > 6) {
                              const dv = calculateRutVerificador(newValue)
                              setValue('UsuDvRut', dv.toLocaleUpperCase())
                            } else {
                              setValue('UsuDvRut', '')
                            }
                          }}
                        error={Boolean(errors.UsuRut)}
                        placeholder='Rut Usuario'
                        inputProps={{
                          maxLength: 8,
                          readOnly: true
                        }}
                      />
                    )}
                  />
                  {errors.UsuRut && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuRut.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Controller
                    name='UsuDvRut'
                    control={control}
                    defaultValue={usuario?.UsuDvRut ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Dígito Verificador'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuDvRut)}
                        placeholder='Dígito Verificador'
                        inputProps={{
                            readOnly: true
                        }}
                      />
                    )}
                  />
                  {errors.UsuDvRut && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuDvRut.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='UsuNombre'
                    control={control}
                    defaultValue={usuario?.UsuNombre ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Nombre Usuario'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuNombre)}
                        placeholder='Nombre Usuario'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.UsuNombre && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.UsuNombre.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='UsuApellido'
                    control={control}
                    defaultValue={usuario?.UsuApellido ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Apellido Usuario'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuApellido)}
                        placeholder='Apellido Usuario'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.UsuApellido && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.UsuApellido.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='UsuEmail'
                    control={control}
                    defaultValue={usuario?.UsuEmail ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Correo Electronico'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuEmail)}
                        placeholder='Usuario@itec.cl'
                        id='filled-multiline-flexible'
                        multiline
                        inputProps={{
                          readOnly: true
                      }}
                      />
                    )}
                  />
                  {errors.UsuEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuEmail.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                      name='UsuRol'
                      control={control}
                      defaultValue={usuario?.UsuRol ?? ''}
                      render={() => (
                        <Autocomplete
                          filterSelectedOptions
                          value={rolSeleccionado}
                          options={listadoRoles ?? []}
                          onChange={(_e, v) => {
                            handleChangeRol(_e, v)
                          }}
                          id='autocomplete-controlled'
                          getOptionLabel={option => option.RolNombre ?? ''}
                          renderInput={params => (
                            <TextField {...params} error={Boolean(errors.UsuRol)} label='Selecciona un Rol' />
                          )}
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option.RolId}>
                               { `${option.RolNombre}  (${option.RolDescripcion})`}
                              </li>
                            )
                          }}
                          disabled
                        />
                      )}
                    />
                    {errors.UsuRol && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuRol.message}</FormHelperText>
                    )}
                  </Grid>


                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Activo'
                    control={control}
                    defaultValue={usuario?.Activo ?? false}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={<Switch checked={value} onChange={onChange} />}
                        label='Activo'
                        sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}
                        id='activo'
                        disabled
                      />
                    )}
                  />
                  {errors.Activo && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.Activo.message}</FormHelperText>
                  )}
                </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
                    <DialogActions
                      sx={{
                        pb: { xs: 8, sm: 12.5 },
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      <Tooltip title={'Actualizar'} arrow>
                        <Button
                          variant='outlined'
                          sx={{ mr: 2 }}
                          color='info'
                          onClick={handleSubmit(actualizarUsuario, onerrors)}
                          disabled={cargando}
                        >
                          <SaveAs sx={{ mr: 1 }} />
                          Actualizar
                        </Button>
                      </Tooltip>
                    </DialogActions>
                  </Grid>
                </Grid>
              </form>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardPerfil
