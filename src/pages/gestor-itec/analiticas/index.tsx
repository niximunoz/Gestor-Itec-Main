import Head from 'next/head'
import { useEffect, useState } from 'react'
import { instanceMiddlewareApi } from 'src/axios'
import { CardAnaliticas } from 'src/components/gestor-itec/analiticas'
import { ParamsProvider } from 'src/context/ParamsContext'
import { ITblUsuario } from 'src/interfaces'
import UserSpinner from 'src/layouts/components/UserSpinner'


const Index = () => {
    const [cargando, setCargando] = useState<boolean>(true)
    const [listadoUsuarios, setListadoUsuarios] = useState<ITblUsuario[]>([])

    const cargarUsuarios = async () => {
        try{
            setCargando(true)
            const { data: dataUsuarios } = await instanceMiddlewareApi.get(
                `/Usuarios/ObtenerUsuarios`)

                if(dataUsuarios.Information.StatusCode == 200){
                    setListadoUsuarios(dataUsuarios.Data ?? [])
                }

        }catch(error){
            console.error(error)
        }finally{
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarUsuarios()
    }, [])
    

  return cargando ? (
    <UserSpinner />
  ) : (
    <>
      <Head>
        <title>Analiticas</title>
        <meta name='description' content='Analiticas' />
      </Head>
      <ParamsProvider>
        <CardAnaliticas listadoUsuarios={listadoUsuarios}/>
      </ParamsProvider>
    
    </>
  )

}

Index.acl = {
  action: 'read',
  subject: 'ADM'
}

export default Index
