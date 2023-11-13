import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@mui/material'
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
  const [cantidadTicketsAsigAbiertos, setCantidadTicketsAsigAbiertos] = useState<number>(0)
  const [cantidadTicketsAsigCerrados, setCantidadTicketsAsigCerrados] = useState<number>(0)
  const [cantidadTicketsAsigEnProceso, setCantidadTicketsAsigEnProceso] = useState<number>(0)
  //Cantidad por Área
  const [cantidadTicketsInformatica, setCantidadTicketsInformatica] = useState<number>(0)
  const [cantidadTicketsRRHH, setCantidadTicketsRRHH] = useState<number>(0)
  const [cantidadTicketsRedes, setCantidadTicketsRedes] = useState<number>(0)

  //general
  const [cantidadTicketsAsignados, setCantidadTicketsAsignados] = useState<number>(0)
  const [cantidadTicketsNoAsignados, setCantidadTicketsNoAsignados] = useState<number>(0)

  const cargarGraficas = async () => {
    try {
      setCargando(true)
      const { data: infoUsuario } = await instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios')
      if (infoUsuario.Data) {
        const usuarioActual = infoUsuario.Data.find((x: ITblUsuario) => x.UsuId == auth.user?.id)

        const { data: CountTicketsGeneralByRutUsuario } = await instanceMiddlewareApi.post(
          `/Parametros/ObtenerCountTicketsGeneralByRutUsuario`,
          {
            IdConsulta: encryptText(usuarioActual.UsuRut.toString())
          }
        )
        //general
        const { data: CountTicketsAll } = await instanceMiddlewareApi.get(
          `/Parametros/ObtenerCountTicketsGeneral`
        )

        //Cantidad por estado rut
        setCantidadTicketsAsigAbiertos(CountTicketsGeneralByRutUsuario.Data.CantidadAbiertos ?? 0)
        setCantidadTicketsAsigCerrados(CountTicketsGeneralByRutUsuario.Data.CantidadCerrados ?? 0)
        setCantidadTicketsAsigEnProceso(CountTicketsGeneralByRutUsuario.Data.CantidadEnProceso ?? 0)


        //Cantidad por Área rut
        setCantidadTicketsInformatica(CountTicketsGeneralByRutUsuario.Data.CantidadInformatica ?? 0)
        setCantidadTicketsRRHH(CountTicketsGeneralByRutUsuario.Data.CantidadRecursosHumanos ?? 0)
        setCantidadTicketsRedes(CountTicketsGeneralByRutUsuario.Data.CantidadRedes ?? 0)

        //general ticket asignados/no asignados
        setCantidadTicketsAsignados(CountTicketsAll.Data.CantidadEnProceso ?? 0)
        setCantidadTicketsNoAsignados(CountTicketsAll.Data.CantidadAbiertos ?? 0)

      }
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }
  const datosEstado = {
    'titulo': 'Estado de Ticket',
    'nombre': ['Abiertos', 'Cerrados', 'En proceso'],
    'cantidad': [cantidadTicketsAsigAbiertos, cantidadTicketsAsigCerrados, cantidadTicketsAsigEnProceso]
  }
  const datosArea = {
    'titulo': 'Área Asignada',
    'nombre': ['Informática', 'RRHH', 'Redes'],
    'cantidad': [cantidadTicketsInformatica, cantidadTicketsRRHH, cantidadTicketsRedes]
  }



  useEffect(() => {

    const inicializar = async () => {
      await cargarGraficas().then(() => {
      })
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

      <Grid container spacing={5} sx={{ mb: 5, height: 400 }}>
        <Grid item xs={12} sm={6}>
          <CardGraficos datosGrafico={datosEstado} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardGraficos datosGrafico={datosArea} />
        </Grid>
      </Grid>
      <CardBarras asignado={cantidadTicketsAsignados} noasignado={cantidadTicketsNoAsignados} />

    </>


  )
}

Home.acl = {
  action: 'read',
  subject: 'ADM'
}

export default Home

