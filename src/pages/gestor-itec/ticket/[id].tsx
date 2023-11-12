

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import { decryptText } from 'src/helpers'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { encryptText } from '../../../helpers/encryptacion';
import { ResumenTicket } from 'src/components/gestor-itec/recepcion-tickets'
import { ITblCategorias, ITblDetalleTicket, ITblEstados, ITblTicket, ITblUsuario } from 'src/interfaces'
import { useParams } from 'src/hooks/useParams'

const Index = () => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [dataTicket, setDataTicket] = useState<ITblTicket | null>(null)
  const [dataDetallesTicket, setDataDetallesTicket] = useState<ITblDetalleTicket[]>([])
  const [dataUsuarios, setDataUsuarios] = useState<ITblUsuario[]>([])
  const [dataCategorias, setDataCategorias] = useState<ITblCategorias[]>([])
  const [dataEstados, setDataEstados] = useState<ITblEstados[]>([])
  const router = useRouter()
  const paramsUse = useParams()

  const cargarDatos = async (id : string) => {
    setCargando(true)
    try {
      const consultasApi = [
        { name: 'Ticket Solicitado', promise: instanceMiddlewareApi.post('/Parametros/ObtenerTicketById',{IdConsulta: encryptText(id)}) },
        { name: 'Detalles Ticket Solicitado', promise: instanceMiddlewareApi.post('/Parametros/ObtenerListadoTicketDetallesById',{IdConsulta: encryptText(id)}) },
        { name: 'Lista de Usuarios', promise: instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios') }
      ]

      const results = await Promise.allSettled(consultasApi.map(req => req.promise))

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Error en la llamada "${consultasApi[index].name}":`, result.reason)
        }
      })

      const TicketCaso = results[0].status === 'fulfilled' ? results[0].value?.data : null
      const DetallesTicketCaso = results[1].status === 'fulfilled' ? results[1].value?.data : []
      const ListaUsuarios = results[2].status === 'fulfilled' ? results[2].value?.data : []

      setDataTicket(TicketCaso.Data)
      setDataDetallesTicket(DetallesTicketCaso.Data)
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
      const id = decryptText(router.query.id)
      if(id != null){
          await cargarDatos(id)
      }
    }
    
    inicializar()
  }, [router.query.id])

  return (
    <>
      <Head>
        <title>Resumen de Ticket</title>
        <meta name='description' content='Resumen de Ticket' />
      </Head>

      {cargando ? (
        <UserSpinner />
      ) : (
        <ResumenTicket 
          infoTicket={dataTicket}
          infoDetallesTicket={dataDetallesTicket}
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


