import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import Head from 'next/head'
import { ITblTicket, ITblUsuario } from 'src/interfaces'
import { instanceMiddlewareApi } from 'src/axios'
import { encryptText } from 'src/helpers'

import CardGraficos from 'src/components/gestor-itec/graficos/CardGraficos'
import { useAuth } from 'src/hooks/useAuth'
import CardBarras from 'src/components/gestor-itec/graficos/CardBarras'
import CardIndicadores from 'src/components/gestor-itec/graficos/CardIndicadores'

export const Home = () => {
  const auth = useAuth()
  const [cargando, setCargando] = useState<boolean>(false)
  // Cantidad por estado
  const [cantidadTicketsAbiertos, setCantidadTicketsAbiertos] = useState<number>(0)
  const [cantidadTicketsCerrados, setCantidadTicketsCerrados] = useState<number>(0)
  const [cantidadTicketsEnProceso, setCantidadTicketsEnProceso] = useState<number>(0)
  //Cantidad por Área
  const [cantidadTicketsInformatica, setCantidadTicketsInformatica] = useState<number>(0)
  const [cantidadTicketsRRHH, setCantidadTicketsRRHH] = useState<number>(0)
  const [cantidadTicketsRedes, setCantidadTicketsRedes] = useState<number>(0)

  //general
  const [cantidadTicketsAsignados, setCantidadTicketsAsignados] = useState<number>(0)
  const [cantidadTicketsNoAsignados, setCantidadTicketsNoAsignados] = useState<number>(0)
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)

  const cargarGraficas = async () => {
    try {
      setCargando(true)

      const { data: infoUsuario } = await instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios')
      if (infoUsuario.Data) {
        const usuarioActual = infoUsuario.Data.find((x: ITblUsuario) => x.UsuId == auth.user?.id)

        let ticketsCreadosAbierto = []
        let ticketsCreadosEnproceso = []
        let ticketsCreadosCerrado = []
        let ticketsCreadosInformatica = []
        let ticketsCreadosRedes = []
        let ticketsCreadosRRHH = []

        if (rolUsuario == 'cliente') {
      
          const { data: ListadiTicketsGeneral } = await instanceMiddlewareApi.get(`/Parametros/ObtenerListadoTickets`)
          ticketsCreadosAbierto = ListadiTicketsGeneral.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id && x.EstadoId == 1).length 
          ticketsCreadosEnproceso = ListadiTicketsGeneral.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id && x.EstadoId == 2).length
          ticketsCreadosCerrado = ListadiTicketsGeneral.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id && x.EstadoId == 3).length
          ticketsCreadosInformatica = ListadiTicketsGeneral.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id && x.CategoriaId == 1).length
          ticketsCreadosRedes = ListadiTicketsGeneral.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id && x.CategoriaId == 2).length 
          ticketsCreadosRRHH = ListadiTicketsGeneral.Data.filter((x: ITblTicket) => x.UserCreaId == auth.user?.id && x.CategoriaId == 3).length
          console.log(ticketsCreadosRRHH.length);
        }
        else if (rolUsuario == 'trabajador') {

          const { data: CountTicketsGeneralByRutUsuario } = await instanceMiddlewareApi.post(
            `/Parametros/ObtenerCountTicketsGeneralByRutUsuario`,
            {
              IdConsulta: encryptText(usuarioActual.UsuRut.toString())
            }
          )
          ticketsCreadosAbierto = CountTicketsGeneralByRutUsuario.Data.CantidadAbiertos ?? 0
          ticketsCreadosEnproceso = CountTicketsGeneralByRutUsuario.Data.CantidadEnProceso ?? 0
          ticketsCreadosCerrado = CountTicketsGeneralByRutUsuario.Data.CantidadCerrados ?? 0

          ticketsCreadosInformatica = CountTicketsGeneralByRutUsuario.Data.CantidadInformatica ?? 0
          ticketsCreadosRedes = CountTicketsGeneralByRutUsuario.Data.CantidadRecursosHumanos ?? 0
          ticketsCreadosRRHH = CountTicketsGeneralByRutUsuario.Data.CantidadRedes ?? 0


        } else if (rolUsuario == 'admin') {
          //general
          const { data: CountTicketsAll } = await instanceMiddlewareApi.get(`/Parametros/ObtenerCountTicketsGeneral`)
          //general ticket asignados/no asignados
          setCantidadTicketsAsignados(CountTicketsAll.Data.CantidadEnProceso ?? 0)
          setCantidadTicketsNoAsignados(CountTicketsAll.Data.CantidadAbiertos ?? 0)
          ticketsCreadosAbierto = CountTicketsAll.Data.CantidadAbiertos ?? 0
          ticketsCreadosEnproceso = CountTicketsAll.Data.CantidadEnProceso ?? 0
          ticketsCreadosCerrado = CountTicketsAll.Data.CantidadCerrados ?? 0

          ticketsCreadosInformatica = CountTicketsAll.Data.CantidadInformatica ?? 0
          ticketsCreadosRedes = CountTicketsAll.Data.CantidadRecursosHumanos ?? 0
          ticketsCreadosRRHH = CountTicketsAll.Data.CantidadRedes ?? 0

        }

        //Cantidad por estado
        setCantidadTicketsAbiertos(ticketsCreadosAbierto)
        setCantidadTicketsCerrados(ticketsCreadosCerrado)
        setCantidadTicketsEnProceso(ticketsCreadosEnproceso)

        //Cantidad por Área
        setCantidadTicketsInformatica(ticketsCreadosInformatica)
        setCantidadTicketsRRHH(ticketsCreadosRRHH)
        setCantidadTicketsRedes(ticketsCreadosRedes)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }
  const datosEstado = {
    titulo: 'Estado de Tickets',
    nombre: ['Abiertos', 'Cerrados', 'En proceso'],
    cantidad: [cantidadTicketsAbiertos, cantidadTicketsCerrados, cantidadTicketsEnProceso]
  }
  const datosArea = {
    titulo: 'Tickets por Área',
    nombre: ['Informática', 'RRHH', 'Redes'],
    cantidad: [cantidadTicketsInformatica, cantidadTicketsRRHH, cantidadTicketsRedes]
  }

  useEffect(() => {
    const inicializar = async () => {
      await cargarGraficas().then(() => { })
    }

    inicializar()
  }, [])

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name='description' content='Home' />
      </Head>

      <CardIndicadores />

      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <CardGraficos datosGrafico={datosEstado} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardGraficos datosGrafico={datosArea} />
        </Grid>
        {rolUsuario == 'admin' && (
          <Grid item xs={12} sm={12}>
            <CardBarras asignado={cantidadTicketsAsignados} noasignado={cantidadTicketsNoAsignados} />
          </Grid>
        )}

      </Grid>
    </>
  )
}

Home.acl = {
  action: 'read',
  subject: 'ADM'
}

export default Home
