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
  Tooltip
} from '@mui/material'
import React, { forwardRef, ReactElement, Ref, useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import UserSpinner from 'src/layouts/components/UserSpinner'
import Swal from 'sweetalert2'
import { instanceMiddlewareApi } from 'src/axios'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaTicket = yup.object({
  Descripción: yup.string().required('Campo Requerido').typeError('Campo Requerido')
})

interface IFormInputs {
  Descripción: string
}

type Props = {
  idTicketAbierto: number | null
}

export const ModalAgregarDetalleTicket = ({
  idTicketAbierto
}: Props) => {
  const {
    handleSubmit,
    control: controlTicket,
    formState: { errors: errorsTicket },
    reset: resetTicket
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaTicket)
  })

  const [cargando, setCargando] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)

  const abrirModal = () => {
    if (idTicketAbierto && idTicketAbierto > 0 && idTicketAbierto != null) {
      setAbrir(true)
    } else {
      setAbrir(true)
    }
  }

  const cerrarModal = () => {
    resetTicket()
    setAbrir(false)
    setCargando(false)
  }


  const guardarDatos = async (data: IFormInputs) => {
    try {
      setCargando(true)
      if(idTicketAbierto != null && idTicketAbierto > 0){
        const { id: idUser } = JSON.parse(window.localStorage.getItem('userData')!)

        const newComentario = {
          TicketId : idTicketAbierto,
          UserCreaId : idUser,
          DetalleTicketDescripcion : data.Descripción
        }

        const { data: dataDetalle } = await instanceMiddlewareApi.post(
          `/Parametros/SaveDetalleTicket`,newComentario)

          if(dataDetalle.Data != null){
            Swal.fire({
              title: 'Exito',
              text: 'Se Creo exitosamente el Comentario',
              icon: 'success',
              confirmButtonColor: '#0098aa',
              confirmButtonText: 'Aceptar'
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

  const onErrors: any = (errors: any, e: any) => console.log(errors, e)

  return (
    <>
          <Button
            sx={{ mr: 2, mb: 2 }}
            variant='outlined'
            color='info'
            startIcon={<Add />}
            onClick={() => abrirModal()}
            className='classBtnAgregarDetalleTicket'
          >
            Ingresar Comentario
          </Button>

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
                  Ingresar Comentario
                  </Typography>
                </Box>

            {cargando ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
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
              <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
                <Save sx={{ mr: 1 }} /> Ingresar
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
