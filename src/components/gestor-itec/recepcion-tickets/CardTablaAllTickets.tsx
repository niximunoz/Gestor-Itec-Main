import { Box, Button, Card, CardContent, CardHeader, Grid, Tooltip } from '@mui/material'
import { DataGridPremium, GridColDef, esES } from '@mui/x-data-grid-premium'
import { useEffect, useState } from 'react'
import { encryptText, escapeRegExp, formatearFecha } from 'src/helpers'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ToolBarBasePremium } from '../datagrid'
import { ModalAgregarTicket } from './ModalAgregarTicket'
import CustomChip from 'src/@core/components/mui/chip'
import Link from 'next/link'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { ITblCategorias, ITblEstados, ITblTicket, ITblUsuario } from 'src/interfaces'
import { ModalAsignarResponsable } from './ModalAsignarResponsable'
import { instanceMiddlewareApi } from 'src/axios'
import { ModalCerrarTicket } from './ModalCerrarTicket'

type Props = {
  listaDatosTickets: ITblTicket[]
  recargar: () => Promise<void>
}

type ChipColor = 'default' | 'info' | 'success' | 'error' | 'warning' | 'primary' | 'secondary'

function getColorForEstado(estadoNombre: string | undefined): ChipColor {
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

export const CardTablaAllTickets = ({ listaDatosTickets, recargar }: Props) => {
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)

  const columns: GridColDef[] = [
    {
      field: 'TickId',
      headerName: 'Id',
      headerAlign: 'center',
      align: 'left',
      flex: 0.5,
      minWidth: 30,
      renderCell: params => (
        <Tooltip title={params.value ? params.value.toString() : ''} arrow>
          <Box
            component='span'
            sx={{
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block'
            }}
          >
            {params.value ? params.value : '-'}
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'UserCreaId',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 100,
      renderCell: params => {
        const usuarioCrea = dataUsuarios.find(x => (x.UsuId == params.value))

        return (
          <Tooltip title={usuarioCrea ? `${usuarioCrea?.UsuNombre}  ${usuarioCrea?.UsuApellido}` : ''} arrow>
            <Box
              component='span'
              sx={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block'
              }}
            >
              {usuarioCrea ? `${usuarioCrea?.UsuNombre}  ${usuarioCrea?.UsuApellido}` : '-'}
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'CategoriaId',
      headerName: 'Área',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 100,
      renderCell: params => {
        const { row } = params
        const categoria = dataCategorias.find(x => (x.CatId == row.CategoriaId))

        return (
          <Tooltip title={categoria ? categoria?.CatNombre : ''} arrow>
            <Box
              component='span'
              sx={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block'
              }}
            >
              {params.value ? categoria?.CatNombre : '-'}
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'TickTitulo',
      headerName: 'Título',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 200,
      renderCell: params => (
        <Tooltip title={params.value ? params.value.toString() : ''} arrow>
          <Box
            component='span'
            sx={{
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block'
            }}
          >
            {params.value ? params.value : '-'}
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'TickDescripcion',
      headerName: 'Descripción',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 200,
      renderCell: params => (
        <Tooltip title={params.value ? params.value.toString() : ''} arrow>
          <Box
            component='span'
            sx={{
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block'
            }}
          >
            {params.value ? params.value : '-'}
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'EstadoId',
      headerName: 'Estado',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 100,
      renderCell: params => {
        const estado = dataEstados.find(x => x.EstadoId === params.value)
        const color = estado ? getColorForEstado(estado.EstadoNombre) : 'warning'

        return (
          <Tooltip title={estado ? estado.EstadoNombre : ''} arrow>
            <Box
              component='span'
              sx={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block'
              }}
            >
              <CustomChip label={estado ? estado.EstadoNombre : '-'} skin='light' color={color} />
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'UserAsignadoRut',
      headerName: 'Responsable',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 100,
      renderCell: params => {
        const usuarioCrea = dataUsuarios.find(x => x.UsuRut == params.value)

        return (
          <Tooltip title={usuarioCrea ? `${usuarioCrea.UsuNombre}  ${usuarioCrea.UsuApellido}` : '-'} arrow>
            <Box
              component='span'
              sx={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block'
              }}
            >
              {usuarioCrea ? `${usuarioCrea.UsuNombre}  ${usuarioCrea.UsuApellido}` : '-'}
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'FechaAsignacion',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 100,
      renderCell: params => (
        <Tooltip title={params.value ? formatearFecha(params.value.toString()) : ''} arrow>
          <Box
            component='span'
            sx={{
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block'
            }}
          >
            {params.value ? formatearFecha(params.value.toString()) : '-'}
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'Acciones',
      headerName: 'Acciones',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      minWidth: 180,
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
            <Link href={`/gestor-itec/ticket/${encryptText(`${row.TickId}`)}`} passHref>
              <a target='_blank' style={{ textDecoration: 'none' }}>
                <Tooltip title={`Ir al Ticket`} arrow>
                  <Button sx={{ mt: 2, mb: 2 }} variant='text' color='success'>
                    <OpenInBrowserIcon />
                  </Button>
                </Tooltip>
              </a>
            </Link>
            {rolUsuario === 'admin' && (
              <ModalAsignarResponsable idTicketSeleccionado={row.TickId} listaDatosTickets={listaDatosTickets} recargar={recargar} />
            )}
            {rolUsuario === 'admin'  || rolUsuario === 'trabajador' ? (
              <ModalCerrarTicket idTicketAbierto={row.TickId} recargar={recargar} infoTicket={row} />
            ) : null}

          </Box>
        )
      }
    }
  ]

  const [cargando, setCargando] = useState<boolean>(true)
  const [listDatos, setListDatos] = useState<ITblTicket[]>([])
  const [listDatosOrigen, setListDatosOrigen] = useState<any[]>([])
  const [row, setRow] = useState<number>(10)
  const [buscar, setBuscar] = useState<string>('')
  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [dataCategorias, setDataCategorias] = useState<ITblCategorias[]>([])
  const [dataEstados, setDataEstados] = useState<ITblEstados[]>([])

  const requestSearch = (texto: string) => {
    setBuscar(texto)
    const searchRegex = new RegExp(escapeRegExp(texto), 'i')
    const FilasFiltradas = listDatosOrigen.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        if (row[field]) return searchRegex.test(row[field].toString())

        return false
      })
    })
    setListDatos(FilasFiltradas)
  }

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const consultasApi = [
        { name: 'Lista de Categorias', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoCategoriasTickets') },
        { name: 'Lista de Estados', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoEstadosTickets') },
        { name: 'Lista de Usuarios', promise: instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      const ListaCategorias = results[0].status === 'fulfilled' ? results[0].value?.data : []
      const ListaEstados = results[1].status === 'fulfilled' ? results[1].value?.data : []
      const ListaUsuarios = results[2].status === 'fulfilled' ? results[2].value?.data : []

      setDataCategorias(ListaCategorias.Data ?? [])
      setDataEstados(ListaEstados.Data ?? [])
      setDataUsuarios(ListaUsuarios.Data ?? [])
      setListDatosOrigen(listaDatosTickets ?? [])
      setListDatos(listaDatosTickets ?? [])
    } catch (error) {
      console.error(error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    const inicializar = async () => {
      await cargarDatos()
    }
    inicializar()
  }, [listaDatosTickets])

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        title={`Historial de Tickets`}
        action={
          <ModalAgregarTicket
            listaDatosUsuarios={dataUsuarios}
            listaDatosCategorias={dataCategorias}
            listaDatosEstados={dataEstados}
            recargar={recargar}
          />
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        {cargando ? (
          <UserSpinner />
        ) : (
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <DataGridPremium
                sx={{ height: '550px' }}
                rows={listDatos.map((item, index) => ({
                  ...item,
                  CorrelativeId: index + 1
                }))}
                columns={columns}
                pageSize={row}
                onPageSizeChange={newPageSize => setRow(newPageSize)}
                rowsPerPageOptions={[5, 10, 20, 50]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                pagination
                getRowId={row => row.CorrelativeId}
                components={{ Toolbar: ToolBarBasePremium }}
                componentsProps={{
                  toolbar: {
                    value: buscar,
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => requestSearch(event.target.value),
                    clearSearch: () => requestSearch(''),
                    disableExport: false
                  }
                }}
                initialState={{ pinnedColumns: { right: ['Acciones'] } }}
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
