import Head from 'next/head'
import { useEffect, useState } from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import { CardAnaliticas } from 'src/components/gestor-itec/analiticas'
import { ITblUsuario } from 'src/interfaces'
import UserSpinner from 'src/layouts/components/UserSpinner'

const Index = () => {
  const [cargando, setCargando] = useState<boolean>(true)
  const [listadoUsuarios, setListadoUsuarios] = useState<ITblUsuario[]>([])
  const [listadoCargaInicialDatos, setListadoCargaInicialDatos] = useState<any | null>()

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      const { data: dataUsuarios } = await instanceMiddlewareApi.get(`/Usuarios/ObtenerUsuarios`)
      const { data: dataCargaInicial } = await instanceMiddlewareApi.get(`/Parametros/ObtenerCountTicketsGeneral`)

      if (dataUsuarios.Information.StatusCode == 200) {
        setListadoUsuarios(dataUsuarios.Data ?? [])
        setListadoCargaInicialDatos(dataCargaInicial)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    const inicializar = async () => {
      await cargarUsuarios()
    }

    inicializar()
  }, [])

  return cargando ? (
    <UserSpinner />
  ) : (
    <>
      <Head>
        <title>Analiticas</title>
        <meta name='description' content='Analiticas' />
      </Head>
      <CardAnaliticas listadoUsuarios={listadoUsuarios} dataCargaInicial={listadoCargaInicialDatos}/>
    </>
  )
}

Index.acl = {
  action: 'read',
  subject: 'ADM'
}

export default Index
