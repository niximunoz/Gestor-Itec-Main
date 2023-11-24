import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import Head from 'next/head'
import { SyntheticEvent, useEffect, useState } from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import { CardTablaAllTickets } from 'src/components/gestor-itec/recepcion-tickets/CardTablaAllTickets'
import { useParams } from 'src/hooks/useParams'
import { ITblCategorias, ITblEstados, ITblTicket, ITblUsuario } from 'src/interfaces'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { useAuth } from 'src/hooks/useAuth'

const Index = () => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [dataTickets, setDataTickets] = useState<ITblTicket[]>([])
  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [dataCategorias, setDataCategorias] = useState<ITblCategorias[]>([])
  const [dataEstados, setDataEstados] = useState<ITblEstados[]>([])
  const paramsUse = useParams()
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)
  const { usuRut: rutUsuario } = JSON.parse(localStorage.getItem('userData')!)
  const auth = useAuth()


  const [tab, setTab] = useState<string>('1')
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const cargarDatos = async () => {
    setCargando(true)
    try {
      const consultasApi = [
        { name: 'Lista de Tickets', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoTickets') },
        { name: 'Lista de Usuarios', promise: instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Error en la llamada "${consultasApi[index].name}":`, result.reason)
        }
      })

      const ListaTickets = results[0].status === 'fulfilled' ? results[0].value?.data : []
      const ListaUsuarios = results[1].status === 'fulfilled' ? results[1].value?.data : []


      let listadoRol = []
      if (rolUsuario === 'cliente') {
        listadoRol = ListaTickets.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id)
      } else if (rolUsuario === 'trabajador') {

        listadoRol = ListaTickets.Data.filter((x: ITblTicket) => x.UserAsignadoRut == rutUsuario)
      } else if (rolUsuario === 'admin') {
        listadoRol = ListaTickets.Data;
      }

      setDataTickets(listadoRol)

      
      setDataUsuarios(ListaUsuarios.Data)
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
        <title>Resumen Global de Tickets</title>
        <meta name='description' content='Resumen Global de Tickets' />
      </Head>

      {cargando ? (
        <UserSpinner />
      ) : (
        <TabContext value={tab}>
          <TabList variant='fullWidth' onChange={handleChangeTab} aria-label='full width tabs example'>
            <Tab value='1' label='Aréa de Informatica' />
            <Tab value='2' label='Aréa de Redes' />
            <Tab value='3' label='Aréa de RRHH' />
          </TabList>
          <TabPanel value='1'>
            <CardTablaAllTickets
              listaDatosTickets={dataTickets.filter(x => x.CategoriaId == 1) ?? []} recargar={cargarDatos}
            />
          </TabPanel>
          <TabPanel value='2'>
            <CardTablaAllTickets
              listaDatosTickets={dataTickets.filter(x => x.CategoriaId == 2) ?? []} recargar={cargarDatos}
            />
          </TabPanel>
          <TabPanel value='3'>
            <CardTablaAllTickets
              listaDatosTickets={dataTickets.filter(x => x.CategoriaId == 3) ?? []} recargar={cargarDatos}
            />
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
