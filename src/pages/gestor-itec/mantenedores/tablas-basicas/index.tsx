import Head from 'next/head'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {Tab} from '@mui/material'
import { CardTablaCategoriasTickets, CardTablaEstadosTickets } from 'src/components/gestor-itec/mantenedores'
import {SyntheticEvent, useEffect, useState} from 'react'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ITblCategorias, ITblEstados } from 'src/interfaces'
import { useParams } from 'src/hooks/useParams'

const Index = () => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [tab, setTab] = useState<string>('1')
  const [dataCategorias, setDataCategorias] = useState<ITblCategorias[]>([])
  const [dataEstados, setDataEstados] = useState<ITblEstados[]>([])
  const paramsUse = useParams()

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const cargarDatos = async () => {
    setCargando(true)
    try {
      setDataCategorias(paramsUse.listadoCategorias ?? [])
      setDataEstados(paramsUse.listadoEstados ?? [])
    } catch (error) {
      console.error('Descripción error:', error)
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
          <Tab value='1' label='Categorías Tickets'/>
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
