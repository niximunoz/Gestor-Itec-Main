import { Add, Close, Save } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  FadeProps,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
  Tooltip
} from '@mui/material'
import React, { forwardRef, ReactElement, Ref, useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import UserSpinner from 'src/layouts/components/UserSpinner'
import Swal from 'sweetalert2'
import { encryptText } from 'src/helpers'
import { instanceMiddlewareApi } from 'src/axios'
import { ITblCategorias, ITblEstados, ITblUsuario } from 'src/interfaces'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaTicket = yup.object({
  Titulo: yup.string().required('Campo Requerido'),
  Categoria: yup.string().required('Campo Requerido'),
  Descripción: yup.string().required('Campo Requerido').typeError('Campo Requerido')
})

interface IFormInputs {
  Titulo: string
  Categoria: string
  Descripción: string
  IdUserAsignado: number | null
  IdEstado: number | null
}

type Props = {
  listaDatosUsuarios: ITblUsuario[]
  listaDatosCategorias: ITblCategorias[]
  listaDatosEstados: ITblEstados[]
}

export const ModalAgregarTicket = ({
  listaDatosUsuarios,
  listaDatosCategorias,
  listaDatosEstados
}: Props) => {
  const {
    handleSubmit,
    control: controlTicket,
    formState: { errors: errorsTicket },
    setValue: setValueTicket,
    reset: resetTicket
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaTicket)
  })

  const [cargando, setCargando] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)
  const [categoriaTicket, setCategoriaTicket] = useState<ITblCategorias | null>(null)
  const [estadoTicket, setEstadoTicket] = useState<ITblEstados | null>(null)
  const [userAsignadoTicket, setUserAsignadoTicket] = useState<ITblUsuario | null>(null)

  const abrirModal = () => {
      setAbrir(true)
  }

  const cerrarModal = () => {
    resetTicket()
    setAbrir(false)
    setCategoriaTicket(null)
    setCargando(false)
  }

  const guardarDatos = async (data: IFormInputs) => {
    try {
      setCargando(true)
      if(data != null){
        const { id: idUser } = JSON.parse(window.localStorage.getItem('userData')!)

        const newTicket = {
          UserCreaId : idUser,
          CategoriaId : categoriaTicket?.CatId,
          TickTitulo : data.Titulo,
          TickDescripcion : data.Descripción,
          EstadoId : estadoTicket?.EstadoId,
          FechaCreacion : new Date(),
          UserAsignadoId: userAsignadoTicket?.UsuId,
          FechaAsignacion: new Date(),
          Activo : true
        }

        const { data: dataTicket } = await instanceMiddlewareApi.post(
          `/Parametros/SaveTicket`,newTicket)

          if(dataTicket.Data != null){
            await Swal.fire({
              title: 'Exito',
              text: 'Se Creo exitosamente el Ticket',
              icon: 'success',
              confirmButtonColor: '#0098aa',
              confirmButtonText: 'Aceptar'
            }).then((result : any) => {
              if(result.isConfirmed){
                cerrarModal()
              }
            })
          }

      }else{
        Swal.fire({
          title: 'Ocurrio un error',
          text: 'No se pudo crear el Ticket',
          icon: 'error',
          confirmButtonColor: '#0098aa',
          confirmButtonText: 'Aceptar'
        })
      }
    } catch (error) {
      console.log(error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  const handleChangeCategoriaTicket = (data: any) => {
    setCategoriaTicket(data)
    setValueTicket('Categoria', data.CatId)
    console.log(encryptText('1'))
  }

  const handleChangeEstadoTicket = (data: any) => {
    setEstadoTicket(data)
    setValueTicket('IdEstado', data.CatId)
  }

  const handleChangeUserCreaTicket = (data: any) => {
    setUserAsignadoTicket(data)
    setValueTicket('IdUserAsignado', data.UsuId)
  }

  const onErrors: any = (errors: any, e: any) => console.log(errors, e)

  return (
    <>
        <Tooltip title={'Agregar Ticket'} arrow>
          <Button
            sx={{ mr: 2, mb: 2 }}
            variant='outlined'
            color='info'
            startIcon={<Add />}
            onClick={() => abrirModal()}
            className='classBtnAgregarTicket'
          >
            Agregar Ticket
          </Button>
        </Tooltip>

      <Dialog
        fullWidth
        open={abrir}
        maxWidth='md'
        scroll='body'
        onClose={cerrarModal}
        TransitionComponent={Transition}
        onBackdropClick={cerrarModal}
      >
        <form onSubmit={handleSubmit(guardarDatos, onErrors)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton size='small' onClick={cerrarModal} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Close />
            </IconButton>

              <Tooltip title={'Nuevo Ticket'} arrow>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                  <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                    Nuevo Ticket
                  </Typography>
                </Box>
              </Tooltip>

            {cargando ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Titulo'
                    control={controlTicket}
                    defaultValue={''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Titulo del Ticket'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errorsTicket.Titulo)}
                        placeholder='Nombre Servicio'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errorsTicket.Titulo && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Titulo.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Categoria'
                    control={controlTicket}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        filterSelectedOptions
                        value={categoriaTicket}
                        id='tags-standard'
                        options={listaDatosCategorias}
                        getOptionLabel={option => option.CatNombre ?? ''}
                        onChange={(e, data) => {
                          onChange(data)
                          handleChangeCategoriaTicket(data)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errorsTicket.Categoria)}
                            fullWidth
                            label='Seleciona la Categoria'
                            variant='outlined'
                          />
                        )}
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.CatId}>
                              {option.CatNombre}
                            </li>
                          )
                        }}
                      />
                    )}
                  />
                  {errorsTicket.Categoria && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Categoria.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='IdEstado'
                    control={controlTicket}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                          filterSelectedOptions
                          value={estadoTicket}
                          id='tags-standard'
                          options={listaDatosEstados}
                          getOptionLabel={option => option.EstadoNombre ?? ''}
                          onChange={(e, data) => {
                            onChange(data)
                            handleChangeEstadoTicket(data)
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errorsTicket.IdEstado)}
                              fullWidth
                              label='Seleciona el Estado'
                              variant='outlined'
                            />
                          )}
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option.EstadoId}>
                                {option.EstadoNombre}
                              </li>
                            )
                          }}
                        />
                    )}
                  />
                  {errorsTicket.IdEstado && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.IdEstado.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='IdUserAsignado'
                    control={controlTicket}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        filterSelectedOptions
                        value={userAsignadoTicket}
                        id='tags-standard'
                        options={listaDatosUsuarios}
                        getOptionLabel={option => `${option.UsuNombre} ${option.UsuApellido}` ?? ''}
                        onChange={(e, data) => {
                          onChange(data)
                          handleChangeUserCreaTicket(data)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errorsTicket.IdUserAsignado)}
                            fullWidth
                            label='Seleciona Al Usuario Responsable'
                            variant='outlined'
                          />
                        )}
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.UsuId}>
                              {option.UsuNombre} {option.UsuApellido}
                            </li>
                          )
                        }}
                      />
                    )}
                  />
                  {errorsTicket.IdUserAsignado && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.IdUserAsignado.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Controller
                      name='Descripción'
                      control={controlTicket}
                      defaultValue={''}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          multiline 
                          rows={6}
                          label='Descripción'
                          onChange={onChange}
                          value={value}
                          error={Boolean(errorsTicket.Descripción)}
                          placeholder='Nombre Servicio'
                          id='textarea-outlined-static'
                        />
                      )}
                    />
                    {errorsTicket.Descripción && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Descripción.message}</FormHelperText>
                    )}
                  </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Tooltip title={'Guardar'} arrow>
              <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
                <Save sx={{ mr: 1 }} /> Guardar
              </Button>
            </Tooltip>
            <Tooltip title={'Cancelar'} arrow>
              <Button variant='outlined' color='secondary' onClick={cerrarModal}>
                Cancelar
              </Button>
            </Tooltip>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
