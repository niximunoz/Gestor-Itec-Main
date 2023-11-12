import Head from 'next/head'
import { CardTablaUsuarios } from 'src/components/gestor-itec/mantenedores'

const Index = () => {

  return (
    <>
      <Head>
        <title>Mantenedor de Usuarios</title>
        <meta name='description' content='Mantenedor de Usuarios'/>
      </Head>

        <CardTablaUsuarios/>

    </>
  )
}

Index.acl = {
  action: 'read',
  subject: 'ADM'
}
export default Index
