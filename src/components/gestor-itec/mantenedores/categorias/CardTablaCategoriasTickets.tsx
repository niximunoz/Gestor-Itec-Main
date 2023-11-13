import { Box, Card, CardContent, CardHeader, Grid, Tooltip } from '@mui/material'
import { DataGridPremium, GridColDef, GridRenderCellParams, esES } from '@mui/x-data-grid-premium'
import { useEffect, useState } from 'react'
import { escapeRegExp } from 'src/helpers'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ITblCategorias } from 'src/interfaces'
import { ToolBarBasePremium } from '../../datagrid'
import { ModalAgregarCategoria } from './agregar'
import { ModalEditarCategoria } from './editar'
import { instanceMiddlewareApi } from 'src/axios'

export const CardTablaCategoriasTickets = () => {
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
      field: 'CatNombre',
      headerName: 'Categoría',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 400,
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
      field: 'Acciones',
      headerName: 'Acciones',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box>
            <ModalEditarCategoria recargar={cargarDatos} data={params.row} />
          </Box>
        )
      }
    }
  ]

  const [cargando, setCargando] = useState<boolean>(true)
  const [listDatos, setListDatos] = useState<ITblCategorias[]>([])
  const [listDatosOrigen, setListDatosOrigen] = useState<ITblCategorias[]>([])
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
      const { data: ListadoCategorias } = await instanceMiddlewareApi.get(
        `/Parametros/ObtenerListadoCategoriasTickets`
      )
        setListDatosOrigen(ListadoCategorias.Data ?? [])
        setListDatos(ListadoCategorias.Data ?? [])
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
  }, [])

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        title={`Listado Categorías`}
        action={
          <ModalAgregarCategoria recargar={cargarDatos}/>
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
