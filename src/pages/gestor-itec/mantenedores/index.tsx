import Head from 'next/head'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {Tab} from '@mui/material'
import { CardTablaCategoriasTickets, CardTablaEstadosTickets } from 'src/components/gestor-itec/mantenedores'
import {SyntheticEvent, useEffect, useState} from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ITblCategorias, ITblEstados } from 'src/interfaces'

const Index = () => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [tab, setTab] = useState<string>('1')
  const [dataCategorias, setDataCategorias] = useState<ITblCategorias[]>([])
  const [dataEstados, setDataEstados] = useState<ITblEstados[]>([])
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const cargarDatos = async () => {
    setCargando(true)
    try {
      const consultasApi = [
        { name: 'Lista de Categorias', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoCategoriasTickets') },
        { name: 'Lista de Estados', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoEstadosTickets') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Error en la llamada "${consultasApi[index].name}":`, result.reason)
        }
      })

      const ListaCategorias = results[0].status === 'fulfilled' ? results[0].value?.data : []
      const ListaEstados = results[1].status === 'fulfilled' ? results[1].value?.data : []

      setDataCategorias(ListaCategorias.Data)
      setDataEstados(ListaEstados.Data)
    } catch (error) {
      console.log('Descripción error:', error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
        cargarDatos()
}, [])

  return (
    <>
      <Head>
        <title>Mantenedores Gestor Itec</title>
        <meta name='description' content='Tablas Básicas del Sistema'/>
      </Head>

      {cargando ? (
        <UserSpinner />
      ) : (
        <TabContext value={tab}>
        <TabList variant='fullWidth' onChange={handleChangeTab} aria-label='full width tabs example'>
          <Tab value='1' label='Categorias Tickets'/>
          <Tab value='2' label='Estados Tickets'/>
        </TabList>
          <TabPanel value='1'>
          <CardTablaCategoriasTickets listaDatosMantenedor={dataCategorias}/>
          </TabPanel>
          <TabPanel value='2'>
          <CardTablaEstadosTickets listaDatosMantenedor={dataEstados}/>
          </TabPanel>
      </TabContext>
      )}
      
    </>
  )
}

Index.acl = {
  action: 'read',
  subject: 'ADM'
}
export default Index
