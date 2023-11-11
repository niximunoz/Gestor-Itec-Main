import Head from 'next/head'
import { useEffect, useState } from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import { CardTablaAllTickets } from 'src/components/gestor-itec/recepcion-tickets/CardTablaAllTickets'
import { encryptText } from 'src/helpers'
import { ITblCategorias, ITblEstados, ITblTicket, ITblUsuario } from 'src/interfaces'
import UserSpinner from 'src/layouts/components/UserSpinner'

const Index = () => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [dataTickets, setDataTickets] = useState<ITblTicket[]>([])
  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [dataCategorias, setDataCategorias] = useState<ITblCategorias[]>([])
  const [dataEstados, setDataEstados] = useState<ITblEstados[]>([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    try {
      const { id: idUser } = JSON.parse(window.localStorage.getItem('userData')!)
      const consultasApi = [
        { name: 'Lista Tickets Asignados', promise: instanceMiddlewareApi.post('/Parametros/ObtenerListadoTicketsById',{IdConsulta: encryptText(idUser.toString())}) },
        { name: 'Lista de Usuarios', promise: instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios') },
        { name: 'Lista de Categorias', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoCategoriasTickets') },
        { name: 'Lista de Estados', promise: instanceMiddlewareApi.get('/Parametros/ObtenerListadoEstadosTickets') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Error en la llamada "${consultasApi[index].name}":`, result.reason)
        }
      })

      const ListaTickets = results[0].status === 'fulfilled' ? results[0].value?.data : []
      const ListaUsuarios = results[1].status === 'fulfilled' ? results[1].value?.data : []
      const ListaCategorias = results[2].status === 'fulfilled' ? results[2].value?.data : []
      const ListaEstados = results[3].status === 'fulfilled' ? results[3].value?.data : []

      setDataTickets(ListaTickets.Data)
      setDataUsuarios(ListaUsuarios.Data)
      setDataCategorias(ListaCategorias.Data)
      setDataEstados(ListaEstados.Data)
    } catch (error) {
      console.error('Descripción error:', error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <Head>
        <title>Resumen Tickets Asignados</title>
        <meta name='description' content='Resumen Tickets Asignados' />
      </Head>

      {cargando ? (
        <UserSpinner />
      ) : (
        <CardTablaAllTickets 
          listaDatosTickets={dataTickets}
          listaDatosUsuarios={dataUsuarios}
          listaDatosCategorias={dataCategorias}
          listaDatosEstados={dataEstados}
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
