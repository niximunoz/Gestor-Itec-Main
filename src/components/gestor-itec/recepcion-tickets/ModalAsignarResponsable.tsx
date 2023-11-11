import { Close, Save } from '@mui/icons-material'
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
import { instanceMiddlewareApi } from 'src/axios'
import { ITblTicket, ITblUsuario } from 'src/interfaces'
import Icon from '@mdi/react'
import { mdiBadgeAccountOutline } from '@mdi/js'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaTicket = yup.object({
  IdUserAsignado: yup.number().required('Campo Requerido')
})

interface IFormInputs {
  IdUserAsignado: number | null
}

type Props = {
  idTicketSeleccionado: number
  listaDatosUsuarios: ITblUsuario[]
  listaDatosTickets: ITblTicket[]
}

export const ModalAsignarResponsable = ({ listaDatosUsuarios, listaDatosTickets, idTicketSeleccionado }: Props) => {
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
  const [ticket, setTicket] = useState<ITblTicket | null>(null)
  const [userAsignadoTicket, setUserAsignadoTicket] = useState<ITblUsuario | null>(null)

  const abrirModal = () => {
    setAbrir(true)
    if (idTicketSeleccionado > 0 && listaDatosUsuarios.length > 0) {
        console.log(listaDatosUsuarios)
      cargarTicket(idTicketSeleccionado)
    }
  }

  const cerrarModal = () => {
    resetTicket()
    setUserAsignadoTicket(null)
    setAbrir(false)
    setCargando(false)
  }

  const guardarDatos = async (data: IFormInputs) => {
    try {
      setCargando(true)
      if (data != null) {
        const newTicket = {
          UserCreaId: ticket?.UserCreaId,
          CategoriaId: ticket?.CategoriaId,
          TickTitulo: ticket?.TickTitulo,
          TickDescripcion: ticket?.TickDescripcion,
          EstadoId: ticket?.EstadoId,
          FechaCreacion: ticket?.FechaCreacion,
          UserAsignadoId: userAsignadoTicket?.UsuId ?? ticket?.UserAsignadoId,
          FechaAsignacion: new Date(),
          Activo: ticket?.Activo
        }

        const { data: dataTicket } = await instanceMiddlewareApi.post(`/Parametros/UpdateTicket`, newTicket)

        if (dataTicket.Data != null) {
          Swal.fire({
            title: 'Exito',
            text: 'Se Actualizo exitosamente el Ticket',
            icon: 'success',
            confirmButtonColor: '#0098aa',
            confirmButtonText: 'Aceptar'
          })
        }
      } else {
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

  const cargarTicket = (idTicket: number) => {
    try {
      setCargando(true)
      if (idTicket > 0) {
        const ticketCaso = listaDatosTickets.find(x => x.TickId == idTicket)
        setTicket(ticketCaso ?? null)
        const userAsignadoCaso = listaDatosUsuarios.find(x => x.UsuId == ticketCaso?.UserAsignadoId)
        setUserAsignadoTicket(userAsignadoCaso ?? null)
      } else {
        Swal.fire({
          title: 'Ocurrio un error',
          text: 'No se pudo cargar el ticket',
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

  const handleChangeUserCreaTicket = (data: ITblUsuario | null) => {
    console.log("Data recibida:", data)
    setUserAsignadoTicket(data)
    const userId = data ? data.UsuId : null;
    setValueTicket('IdUserAsignado', userId, { shouldValidate: true });
  }
  const onErrors: any = (errors: any, e: any) => console.log(errors, e)

  return (
    <>
      <Tooltip title={`Asignar Responsable`} arrow>
        <Button sx={{ mt: 2, mb: 2 }} variant='text' color='info' onClick={() => abrirModal()}>
          <Icon path={mdiBadgeAccountOutline} size={1} />
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

            <Tooltip title={'Asignar Responsable'} arrow>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Asignar Responsable
                </Typography>
              </Box>
            </Tooltip>

            {cargando ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='IdUserAsignado'
                    control={controlTicket}
                    defaultValue={null}
                    render={() => (
                      <Autocomplete
                        filterSelectedOptions
                        value={userAsignadoTicket ?? null}
                        id='tags-standard'
                        options={listaDatosUsuarios}
                        getOptionLabel={option => `${option.UsuNombre} ${option.UsuApellido}` ?? ''}
                        onChange={(e, data) => {
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
