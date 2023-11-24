import Head from 'next/head'
import { useEffect, useState } from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import { CardTablaAllTickets } from 'src/components/gestor-itec/recepcion-tickets/CardTablaAllTickets'
import { useAuth } from 'src/hooks/useAuth'
import { ITblTicket } from 'src/interfaces'
import UserSpinner from 'src/layouts/components/UserSpinner'

const Index = () => {
  const auth = useAuth()
  const [cargando, setCargando] = useState<boolean>(true)
  const [dataTickets, setDataTickets] = useState<ITblTicket[]>([])
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)
  const { usuRut: rutUsuario } = JSON.parse(localStorage.getItem('userData')!)


  const cargarDatos = async () => {
    setCargando(true)
    try {
      const consultasApi = [
        { name: 'Lista de Tickets', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoTickets') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Error en la llamada "${consultasApi[index].name}":`, result.reason)
        }
      })
      const ListaTickets = results[0].status === 'fulfilled' ? results[0].value?.data : []
      let listadoRol = []

      if (rolUsuario === 'cliente') {
        listadoRol = ListaTickets.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id)
      } else if (rolUsuario === 'trabajador') {
        
        listadoRol = ListaTickets.Data.filter((x: ITblTicket) => x.UserAsignadoRut == rutUsuario)
      } else if (rolUsuario === 'admin') {
        listadoRol = ListaTickets.Data;
      }
      setDataTickets(listadoRol)
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
        <CardTablaAllTickets
          listaDatosTickets={dataTickets}
          recargar={cargarDatos}
        />
      )}

    </>
  )

}

Index.acl = {
  action: 'read',
  subject: 'ADM'
}

export default Index
