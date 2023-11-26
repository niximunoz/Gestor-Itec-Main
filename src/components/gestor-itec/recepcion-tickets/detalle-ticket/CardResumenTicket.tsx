import { useEffect, useState } from 'react'
import UserSpinner from 'src/layouts/components/UserSpinner'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  DialogActions,
  TextField,
  FormHelperText,
  Autocomplete,
  DialogContent,
  CardActions,
  Button,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Swal from 'sweetalert2'
import {
  ITblCategorias,
  ITblDetalleTicket,
  ITblDocumentosTicket,
  ITblEstados,
  ITblTicket,
  ITblUsuario
} from 'src/interfaces'
import { TimeLineDetalleTicket } from './TimeLineDetalleTicket'
import { ModalAgregarDetalleTicket } from './ModalAgregarDetalleTicket'
import { ModalCerrarTicket } from './ModalCerrarTicket'
import { instanceMiddlewareApi } from 'src/axios'
import CustomChip from 'src/@core/components/mui/chip'
import { encryptText } from 'src/helpers'

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
}

export const ResumenTicket = ({ infoTicket }: Props) => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [ticket, setTicket] = useState<ITblTicket | null>(null)
  const [categoriaTicket, setCategoriaTicket] = useState<ITblCategorias | null>(null)
  const [estadoTicket, setEstadoTicket] = useState<ITblEstados | null>(null)
  const [userAsignadoTicket, setUserAsignadoTicket] = useState<ITblUsuario | null>(null)

  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [listadoDetallesTicket, setListadoDetallesTicket] = useState<ITblDetalleTicket[]>([])
  const [listadoDocumentosTicket, setListadoDocumentosTicket] = useState<ITblDocumentosTicket[]>([])
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)

  const {
    control: controlTicket,
    formState: { errors: errorsTicket },
    setValue: setValueTicket
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaTicket)
  })

  const cargarDetalleTicket = async () => {
    try {
      const { data: DataDetallesTicket } = await instanceMiddlewareApi.post(
        '/Parametros/ObtenerListadoTicketDetallesById',
        { IdConsulta: encryptText(infoTicket?.TickId.toString() ?? '') }
      )
      const { data: ListadoDocumentosTicket } = await instanceMiddlewareApi.post(
        '/Parametros/ObtenerDocumentosTicketById',
        { IdConsulta: encryptText(infoTicket?.TickId.toString() ?? '') }
      )
      setListadoDetallesTicket(DataDetallesTicket.Data ?? [])
      console.log(ListadoDocumentosTicket)
      setListadoDocumentosTicket(ListadoDocumentosTicket.Data ?? [])
    } catch (error) {
      console.error(error)
    }
  }

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const consultasApi = [
        { name: 'Lista de Usuarios', promise: instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios') },
        {
          name: 'Lista de Categorias',
          promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoCategoriasTickets')
        },
        { name: 'Lista de Estados', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoEstadosTickets') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      const ListaUsuarios = results[0].status === 'fulfilled' ? results[0].value?.data : null
      const ListaCategorias = results[1].status === 'fulfilled' ? results[1].value?.data : []
      const ListaEstados = results[2].status === 'fulfilled' ? results[2].value?.data : []

      setDataUsuarios(ListaUsuarios.Data)
      if (infoTicket != null) {
        await cargarDetalleTicket()
        setTicket(infoTicket)
        setValueTicket('Titulo', infoTicket.TickTitulo)
        setValueTicket('Descripción', infoTicket.TickDescripcion)

        const categoriaFind = ListaCategorias.Data.find((x: ITblCategorias) => x.CatId == infoTicket.CategoriaId)
        setCategoriaTicket(categoriaFind ?? null)
        setValueTicket('CategoriaTicket', categoriaFind?.CatNombre ?? null)

        const estadoFind = ListaEstados.Data.find((x: ITblEstados) => x.EstadoId == infoTicket.EstadoId)
        setEstadoTicket(estadoFind ?? null)
        setValueTicket('EstadoTicket', estadoFind?.EstadoNombre ?? null)

        const userCreaFind = ListaUsuarios.Data.find((x: ITblUsuario) => x.UsuRut == infoTicket.UserAsignadoRut)
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

  const handleChangeUserCreaTicket = (data: any) => {
    setUserAsignadoTicket(data)
    setValueTicket('UserAsignado', data.UsuId)
  }

  type ChipColor = 'default' | 'info' | 'success' | 'error' | 'warning' | 'primary' | 'secondary'

  function getColor(estadoNombre: string | undefined): ChipColor {
    switch (estadoNombre) {
      case 'En Proceso':
        return 'info'
      case 'Abierto':
        return 'success'
      case 'Cerrado':
        return 'error'
      default:
        return 'warning'
    }
  }

  useEffect(() => {
    if (infoTicket && infoTicket != null) {
      cargarDatos()
    }
  }, [])

  return cargando ? (
    <UserSpinner />
  ) : (
    <>
      <Card sx={{ mb: 5, position: 'relative' }}>
        <CardHeader
          sx={{ display: 'flex', alignItems: 'center', paddingLeft: '45px' }}
          title={`Detalle Ticket N° ${ticket?.TickId}`}
          subheader={
            <>
              <CustomChip label={categoriaTicket?.CatNombre} color={'info'} sx={{ marginRight: '8px' }} />
              <CustomChip
                label={estadoTicket?.EstadoNombre}
                skin='light'
                color={getColor(estadoTicket?.EstadoNombre)}
              />
            </>
          }
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 5 }, pt: { xs: 8, sm: 1.5 }, position: 'relative' }}>
            {cargando ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={8}>
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
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                  />
                  {errorsTicket.Titulo && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Titulo.message}</FormHelperText>
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
                        options={dataUsuarios}
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
                        disabled
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
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                  />
                  {errorsTicket.Descripción && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Descripción.message}</FormHelperText>
                  )}
                </Grid>

                <Grid container spacing={2} style={{ marginTop: '32px' }}>
                  {listadoDocumentosTicket.map(doc => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={doc.InfoDocumento.DocumentoNombreModificado}>
                      <Card sx={{height: 150}}>
                        <CardContent>
                          {/* Contenido de la tarjeta, como el nombre del archivo y un icono */}
                          <Typography variant="body1">{doc.InfoDocumento.DocumentoNombreModificado}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" href={doc.InfoDocumento.RutaArchivoAlmacenado} target="_blank">
                            Ver / Descargar
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TimeLineDetalleTicket detalleTicket={listadoDetallesTicket} listaDatosUsuarios={dataUsuarios} />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          {(rolUsuario == 'admin' && ticket?.EstadoId != 3) || (rolUsuario == 'trabajador' && ticket?.EstadoId != 3) ? (
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'space-between' }}>
              <ModalAgregarDetalleTicket idTicketAbierto={ticket?.TickId ?? null} recargar={cargarDetalleTicket} />
              <ModalCerrarTicket
                idTicketAbierto={ticket?.TickId ?? null}
                recargar={cargarDetalleTicket}
                infoTicket={infoTicket}
              />
            </DialogActions>
          ) : null}
        </CardContent>
      </Card>
    </>
  )
}
