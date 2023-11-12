import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Fade, FadeProps, Grid, IconButton, Tooltip } from '@mui/material'
import { DataGridPremium, GridColDef, esES } from '@mui/x-data-grid-premium'
import { ReactElement, Ref, forwardRef, useEffect, useState } from 'react'
import { encryptText, escapeRegExp, formatearFecha } from 'src/helpers'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ToolBarBasePremium } from '../datagrid'
import CustomChip from 'src/@core/components/mui/chip'
import Link from 'next/link'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { ITblCategorias, ITblEstados, ITblTicket, ITblUsuario } from 'src/interfaces'
import { instanceMiddlewareApi } from 'src/axios'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Close } from 'mdi-material-ui'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

type Props = {
  listaDatosTickets: ITblTicket[]
  listaDatosUsuarios: ITblUsuario[]
}

export const ModalTablaTickets = ({
  listaDatosTickets,
  listaDatosUsuarios
}: Props) => {
  const columns: GridColDef[] = [
    {
      field: 'CorrelativeId',
      headerName: 'N°',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      width: 30,
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
        const { row } = params
        const usuarioCrea = listaDatosUsuarios.find(x => (x.UsuId = row.UserCreaId))

        return (
          <Tooltip title={params.value ? `${usuarioCrea?.UsuNombre}  ${usuarioCrea?.UsuApellido}` : ''} arrow>
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
              {params.value ? `${usuarioCrea?.UsuNombre}  ${usuarioCrea?.UsuApellido}` : '-'}
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
        const categoria = listadoCategorias.find(x => (x.CatId = row.CategoriaId))

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
        const { row } = params
        const estado = listadoEstados.find(x => (x.EstadoId == row.EstadoId))

        return (
          <Tooltip title={estado ? estado?.EstadoNombre : ''} arrow>
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
              <CustomChip
                label={params.value ? estado?.EstadoNombre : '-'}
                skin='light'
                color={
                  estado?.EstadoNombre === 'En Proceso'
                    ? 'info'
                    : estado?.EstadoNombre === 'Abierto'
                      ? 'success'
                      : estado?.EstadoNombre === 'Cerrado'
                        ? 'error'
                        : 'warning'
                }
              />
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'UserAsignadoId',
      headerName: 'Responsable',
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      minWidth: 100,
      renderCell: params => {
        const { row } = params
        const usuarioCrea = listaDatosUsuarios.find(x => (x.UsuId = row.UserAsignadoId))

        return (
          <Tooltip title={params.value ? `${usuarioCrea?.UsuNombre}  ${usuarioCrea?.UsuApellido}` : ''} arrow>
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
              {params.value ? `${usuarioCrea?.UsuNombre}  ${usuarioCrea?.UsuApellido}` : '-'}
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
      width: 100,
      renderCell: params => {
        const { row } = params
        console.log(dataUsuarios)

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
          </Box>
        )
      }
    }
  ]

  const [cargando, setCargando] = useState<boolean>(true)
  const [listDatos, setListDatos] = useState<any[]>([])
  const [listDatosOrigen, setListDatosOrigen] = useState<any[]>([])
  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [listadoCategorias, setListadoCategorias] = useState<ITblCategorias[]>([])
  const [listadoEstados, setListadoEstados] = useState<ITblEstados[]>([])
  const [row, setRow] = useState<number>(10)
  const [buscar, setBuscar] = useState<string>('')
  const [abrir, setAbrir] = useState<boolean>(false)

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
      const { data: ListadoCategorias } = await instanceMiddlewareApi.get(`/Parametros/ObtenerListadoCategoriasTickets`)
      const { data: ListadoEstados } = await instanceMiddlewareApi.get(`/Parametros/ObtenerListadoEstadosTickets`)

      setListadoCategorias(ListadoCategorias.Data ?? [])
      setListadoEstados(ListadoEstados.Data ?? [])


      setListDatosOrigen(listaDatosTickets)
      setListDatos(listaDatosTickets)
      setDataUsuarios(listaDatosUsuarios)
    } catch (error) {
      console.log(error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  const abrirModal = () => {
    setAbrir(true)
  }

  const cerrarModal = () => {
    setDataUsuarios([])
    setListadoCategorias([])
    setListadoEstados([])
    setAbrir(false)
    setCargando(false)
  }

  useEffect(() => {
    if (listaDatosTickets.length > 0 && listaDatosUsuarios.length > 0) {
      cargarDatos()
    } else {
      setCargando(false)
    }
  }, [listaDatosTickets, listaDatosUsuarios])

  return (
    <>
      <Tooltip title={`Ir al Ticket`} arrow>
        <Button sx={{ mt: 2, mb: 2 }} variant='text' color='info' onClick={() => abrirModal()}>
          <ManageSearchIcon />
        </Button>
      </Tooltip>

      <Dialog
        fullWidth
        open={abrir}
        maxWidth='lg'
        scroll='body'
        onClose={cerrarModal}
        TransitionComponent={Transition}
        onBackdropClick={cerrarModal}
      >

        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton size='small' onClick={cerrarModal} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Close />
          </IconButton>
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
                  getRowId={row => row.TickId}
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
        </DialogContent>
      </Dialog>
    </>
  )
}
