import { Box, Card, CardContent, CardHeader, Grid, Tooltip } from '@mui/material'
import { DataGridPremium, GridColDef, esES } from '@mui/x-data-grid-premium'
import { useEffect, useState } from 'react'
import { escapeRegExp } from 'src/helpers'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ITblUsuario } from 'src/interfaces'
import { ToolBarBasePremium } from '../../datagrid'
import { instanceMiddlewareApi } from 'src/axios'
import CustomChip from 'src/@core/components/mui/chip'
import { ModalAgregarUsuario } from './agregar'

export const CardTablaUsuarios = () => {
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
      field: 'UsuRut',
      headerName: 'Rut Usuario',
      headerAlign: 'center',
      align: 'center',
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
      field: 'UsuDvRut',
      headerName: 'Dv Rut',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'UsuNombre',
      headerName: 'Nombre Usuario',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'UsuApellido',
      headerName: 'Apellido Usuario',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'UsuEmail',
      headerName: 'Email Usuario',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'UsuRol',
      headerName: 'Rol Usuario',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'FechaModificacion',
      headerName: 'Fecha Mofificación',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'FechaCreacion',
      headerName: 'Fecha Creación',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
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
      field: 'Activo',
      headerName: 'Activo',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200,
      renderCell: params => (
        <Tooltip title={params.value ? 'Sí' : 'No'} arrow>
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
            <CustomChip label={params.value ? 'Sí' : 'No'} skin='light' color={params.value ? 'success' : 'error'} />
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
    }
  ]

  const [cargando, setCargando] = useState<boolean>(true)
  const [listDatos, setListDatos] = useState<ITblUsuario[]>([])
  const [listDatosOrigen, setListDatosOrigen] = useState<ITblUsuario[]>([])
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

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const { data: ListadoUsuarios } = await instanceMiddlewareApi.get(
        `/Usuarios/ObtenerUsuarios`
      )
      setListDatosOrigen(ListadoUsuarios.Data ?? [])
      setListDatos(ListadoUsuarios.Data ?? [])
    } catch (error) {
      console.log(error)
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
  }, [])

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        title={`Listado Usuarios`}
        action={
            <ModalAgregarUsuario
              recargar={cargarDatos}
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
                autoHeight
                getRowId={row => row.CorrelativeId}
                components={{ Toolbar: ToolBarBasePremium }}
                componentsProps={{
                  toolbar: {
                    value: buscar,
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                      requestSearch(event.target.value),
                    clearSearch: () => requestSearch(''),
                    disableExport: false
                  },
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
