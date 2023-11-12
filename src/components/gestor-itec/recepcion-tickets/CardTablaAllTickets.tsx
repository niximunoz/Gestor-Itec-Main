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

type Props = {
  listaDatosTickets: ITblTicket[]
  listaDatosUsuarios: ITblUsuario[]
  listaDatosCategorias: ITblCategorias[]
  listaDatosEstados: ITblEstados[]
}

export const CardTablaAllTickets = ({
  listaDatosTickets,
  listaDatosUsuarios,
  listaDatosCategorias,
  listaDatosEstados
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
        const categoria = listaDatosCategorias.find(x => (x.CatId = row.CategoriaId))

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
        const estado = listaDatosEstados.find(x => x.EstadoId == params.value)

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
            <ModalAsignarResponsable
              idTicketSeleccionado={row.TickId}
              listaDatosUsuarios={listaDatosUsuarios ?? dataUsuarios}
              listaDatosTickets={listaDatosTickets}
            />
          </Box>
        )
      }
    }
  ]

  const [cargando, setCargando] = useState<boolean>(true)
  const [listDatos, setListDatos] = useState<any[]>([])
  const [listDatosOrigen, setListDatosOrigen] = useState<any[]>([])
  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [row, setRow] = useState<number>(10)
  const [buscar, setBuscar] = useState<string>('')

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

  const cargarDatos = () => {
    try {
      setCargando(true)
      setListDatosOrigen(listaDatosTickets)
      setListDatos(listaDatosTickets)
      console.log(listaDatosUsuarios)
      setDataUsuarios(listaDatosUsuarios)
    } catch (error) {
      console.log(error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (listaDatosTickets.length > 0 && listaDatosUsuarios.length > 0) {
      cargarDatos()
    } else {
      setCargando(false)
    }
  }, [listaDatosTickets, listaDatosUsuarios])

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        title={`Historial de Tickets`}
        action={
          <ModalAgregarTicket
            listaDatosUsuarios={listaDatosUsuarios}
            listaDatosCategorias={listaDatosCategorias}
            listaDatosEstados={listaDatosEstados}
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
      </CardContent>
    </Card>
  )
}
