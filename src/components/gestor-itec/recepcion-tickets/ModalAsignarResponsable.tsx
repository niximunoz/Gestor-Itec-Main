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
  RutUsuarioAsignado: yup.number().required('Campo Requerido')
})

interface IFormInputs {
  RutUsuarioAsignado: number | null
}

type Props = {
  idTicketSeleccionado: number
  listaDatosTickets: ITblTicket[]
  recargar: () => Promise<void>
}

export const ModalAsignarResponsable = ({ listaDatosTickets, idTicketSeleccionado, recargar}: Props) => {
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
  const [listadoUsuariosMantenedor, setListadoUsuariosMantenedor] = useState<ITblUsuario[]>([])
  const [listadoOpcionUsuarios, setListadoOpcionUsuarios] = useState<ITblUsuario[]>([])

  const abrirModal = () => {
    setAbrir(true)
    if (idTicketSeleccionado > 0) {
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
          ...ticket,
          TickId: ticket?.TickId,
          EstadoId: userAsignadoTicket?.UsuRut != null ? 2 : 1,
          UserAsignadoRut: userAsignadoTicket?.UsuRut ?? ticket?.UserAsignadoRut,
          FechaAsignacion: new Date(),
        }

        const { data: dataTicket } = await instanceMiddlewareApi.post(`/Parametros/UpdateTicket`, newTicket)

        if (dataTicket.Data != null) {
          await Swal.fire({
            title: 'Exito',
            text: `Ticket N°${ticket?.TickId} asignado correctamente.`,
            icon: 'success',
            confirmButtonColor: '#0098aa',
            confirmButtonText: 'Aceptar'
          }).then((result: any) => {
            if (result.isConfirmed) {
              cerrarModal();
              recargar()
            }
          })
        }
      } else {
        Swal.fire({
          title: 'Ocurrio un error',
          text: 'No se pudo asignar el Ticket',
          icon: 'error',
          confirmButtonColor: '#0098aa',
          confirmButtonText: 'Aceptar'
        })
      }
    } catch (error) {
      console.error(error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  const cargarTicket = async (idTicket: number) => {
    try {
      setCargando(true)
      const { data: ListadoUsuarios } = await instanceMiddlewareApi.get(`/Usuarios/ObtenerUsuarios`)
      setListadoUsuariosMantenedor(ListadoUsuarios.Data ?? [])
      if (idTicket > 0) {
        const ticketCaso = listaDatosTickets.find(x => x.TickId == idTicket )
        setTicket(ticketCaso ?? null)
        const userAsignadoCaso = ListadoUsuarios.Data.find((x : ITblUsuario) => x.UsuRut == ticketCaso?.UserAsignadoRut )
        //cambiar quizas
        setListadoOpcionUsuarios(ListadoUsuarios.Data.filter((x : ITblUsuario) => x.UsuRol == 'trabajador' ))
        // console.log(listadoOpcionUsuarios)
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
    setUserAsignadoTicket(data)
    const userRut = data ? data.UsuRut : null
    setValueTicket('RutUsuarioAsignado', userRut, { shouldValidate: true })
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

              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Asignar Responsable
                </Typography>
              </Box>

            {cargando ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='RutUsuarioAsignado'
                    control={controlTicket}
                    defaultValue={null}
                    render={() => (
                      <Autocomplete
                        filterSelectedOptions
                        value={userAsignadoTicket ?? null}
                        id='tags-standard'
                        options={listadoOpcionUsuarios}
                        getOptionLabel={option => `${option.UsuNombre} ${option.UsuApellido}` ?? ''}
                        onChange={(e, data) => {
                          handleChangeUserCreaTicket(data)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errorsTicket.RutUsuarioAsignado)}
                            fullWidth
                            label='Selecionar Responsable...'
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
                  {errorsTicket.RutUsuarioAsignado && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errorsTicket.RutUsuarioAsignado.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
                <Save sx={{ mr: 1 }} /> Asignar
              </Button>
              <Button variant='outlined' color='secondary' onClick={cerrarModal}>
                Cancelar
              </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
