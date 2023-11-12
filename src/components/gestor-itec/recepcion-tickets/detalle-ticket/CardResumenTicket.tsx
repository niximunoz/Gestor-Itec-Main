import { useEffect, useState } from 'react'
import UserSpinner from 'src/layouts/components/UserSpinner'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  DialogActions,
  Tooltip,
  Button,
  TextField,
  FormHelperText,
  Autocomplete,
  DialogContent
} from '@mui/material'
import { Save } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Swal from 'sweetalert2'
import { ITblCategorias, ITblDetalleTicket, ITblEstados, ITblTicket, ITblUsuario } from 'src/interfaces'
import { TimeLineDetalleTicket } from './TimeLineDetalleTicket'
import { ModalAgregarDetalleTicket } from './ModalAgregarDetalleTicket'
import { instanceMiddlewareApi } from 'src/axios'

const schemaTicket = yup.object({
  Titulo: yup.string().required('Campo Requerido'),
  CategoriaTicket: yup.string().required('Campo Requerido').typeError('Campo Requerido'),
  Descripción: yup.string().required('Campo Requerido').typeError('Campo Requerido')
})

interface IFormInputs {
  Titulo: string
  Descripción: string
  CategoriaTicket: string | null
  UserAsignado: string | null
  EstadoTicket: string | null
}

type Props = {
  infoTicket: ITblTicket | null
  infoDetallesTicket: ITblDetalleTicket[]
  listaDatosUsuarios: ITblUsuario[]
  listaDatosCategorias: ITblCategorias[]
  listaDatosEstados: ITblEstados[]
}

export const ResumenTicket = ({
  infoTicket,
  infoDetallesTicket,
  listaDatosUsuarios,
  listaDatosCategorias,
  listaDatosEstados
}: Props) => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [ticket, setTicket] = useState<ITblTicket | null>(null)
  const [categoriaTicket, setCategoriaTicket] = useState<ITblCategorias | null>(null)
  const [estadoTicket, setEstadoTicket] = useState<ITblEstados | null>(null)
  const [userAsignadoTicket, setUserAsignadoTicket] = useState<ITblUsuario | null>(null)

  const {
    handleSubmit,
    control: controlTicket,
    formState: { errors: errorsTicket },
    setValue: setValueTicket
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaTicket)
  })

  const guardarDatos = async (data: IFormInputs) => {
    try {
      setCargando(true)
      if (ticket != null) {
        const { id: idUser } = JSON.parse(window.localStorage.getItem('userData')!)

        const newTicket = {
          TickId: ticket.TickId,
          UserCreaId: idUser,
          CategoriaId: categoriaTicket?.CatId,
          TickTitulo: data.Titulo,
          TickDescripcion: data.Descripción,
          EstadoId: estadoTicket?.EstadoId,
          FechaCreacion: ticket.FechaCreacion,
          UserAsignadoId: userAsignadoTicket?.UsuId,
          FechaAsignacion: new Date(),
          Activo: ticket.Activo
        }

        const { data: dataTicket } = await instanceMiddlewareApi.post(`/Parametros/UpdateTicket`, newTicket)

        if (dataTicket.Data != null) {
          Swal.fire({
            title: 'Éxito',
            text: 'Se agregó el comentario exitosamente.',
            icon: 'success',
            confirmButtonColor: '#0098aa',
            confirmButtonText: 'Aceptar'
          })
        }
      } else {
        Swal.fire({
          title: 'Ocurrio un error',
          text: 'No se pudo agregar el comentario.',
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

  const cargarDatos = () => {
    try {
      setCargando(true)
      if (infoTicket != null) {
        setTicket(infoTicket)
        setValueTicket('Titulo', infoTicket.TickTitulo)
        setValueTicket('Descripción', infoTicket.TickDescripcion)

        const categoriaFind = listaDatosCategorias.find(x => x.CatId == infoTicket.CategoriaId)
        setCategoriaTicket(categoriaFind ?? null)
        setValueTicket('CategoriaTicket', categoriaFind?.CatNombre ?? null)

        const estadoFind = listaDatosEstados.find(x => x.EstadoId == infoTicket.EstadoId)
        setEstadoTicket(estadoFind ?? null)
        setValueTicket('EstadoTicket', estadoFind?.EstadoNombre ?? null)

        const userCreaFind = listaDatosUsuarios.find(x => x.UsuRut == infoTicket.UserAsignadoRut)
        setUserAsignadoTicket(userCreaFind ?? null)
        setValueTicket('UserAsignado', userCreaFind?.UsuNombre ?? null)
      } else {
        Swal.fire({
          title: 'Ocurrio un error',
          text: 'No se pudo cargar el Ticket',
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
    setValueTicket('CategoriaTicket', data.CatId)
  }

  const handleChangeEstadoTicket = (data: any) => {
    setEstadoTicket(data)
    setValueTicket('EstadoTicket', data.EstadoId)
  }

  const handleChangeUserCreaTicket = (data: any) => {
    setUserAsignadoTicket(data)
    setValueTicket('UserAsignado', data.UsuId)
  }

  useEffect(() => {
    if (infoTicket && infoTicket != null) {
      cargarDatos()
    }
  }, [infoDetallesTicket, listaDatosUsuarios, listaDatosCategorias, listaDatosEstados])

  const onErrors: any = (errors: any, e: any) => console.log(errors, e)

  return cargando ? (
    <UserSpinner />
  ) : (
    <>
      <Card sx={{ mb: 5, position: 'relative' }}>
        <CardHeader
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          title={`Detalle Ticket N° ${ticket?.TickId}`}
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
          <form onSubmit={handleSubmit(guardarDatos, onErrors)}>
            <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 5 }, pt: { xs: 8, sm: 1.5 }, position: 'relative' }}>
              {cargando ? (
                <UserSpinner />
              ) : (
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='Titulo'
                      control={controlTicket}
                      defaultValue={''}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          label='Título'
                          onChange={onChange}
                          value={value}
                          error={Boolean(errorsTicket.Titulo)}
                          id='filled-multiline-flexible'
                          multiline
                          // InputProps={{
                          //   readOnly: true,
                          // }}
                        />
                      )}
                    />
                    {errorsTicket.Titulo && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Titulo.message}</FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='CategoriaTicket'
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
                              error={Boolean(errorsTicket.CategoriaTicket)}
                              fullWidth
                              label='Categoría'
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
                    {errorsTicket.CategoriaTicket && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errorsTicket.CategoriaTicket.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='EstadoTicket'
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
                              error={Boolean(errorsTicket.EstadoTicket)}
                              fullWidth
                              label='Estado'
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
                    {errorsTicket.EstadoTicket && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.EstadoTicket.message}</FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='UserAsignado'
                      control={controlTicket}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterSelectedOptions
                          value={userAsignadoTicket}
                          id='tags-standard'
                          options={listaDatosUsuarios}
                          getOptionLabel={option => `${option.UsuNombre ?? ''} ${option.UsuApellido ?? ''}` ?? ''}
                          onChange={(e, data) => {
                            onChange(data)
                            handleChangeUserCreaTicket(data)
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errorsTicket.UserAsignado)}
                              fullWidth
                              label='Responsable'
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
                    {errorsTicket.UserAsignado && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.UserAsignado.message}</FormHelperText>
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
                          id='textarea-outlined-static'
                        />
                      )}
                    />
                    {errorsTicket.Descripción && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Descripción.message}</FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TimeLineDetalleTicket detalleTicket={infoDetallesTicket} listaDatosUsuarios={listaDatosUsuarios} />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'space-between' }}>
              <ModalAgregarDetalleTicket idTicketAbierto={ticket?.TickId ?? null} />

              <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
                <Save sx={{ mr: 1 }} /> Guardar
              </Button>
            </DialogActions>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
