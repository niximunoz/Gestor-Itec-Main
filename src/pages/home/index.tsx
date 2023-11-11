import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'
import { AttachMoney, Euro, LocalAtm, Archive, Person } from '@mui/icons-material'
import { Box } from '@mui/material'
import UserSpinner from 'src/layouts/components/UserSpinner'
import Head from 'next/head'

const Home = () => {
  const dataApi: any[] = []
  const [indicadores, setIndicadores] = useState<any[]>([])

  const getInfoIndicadores = async () => {
    try {
      const { data: Res } = await axios.get('https://mindicador.cl/api')

      if (Res) {
        dataApi.push(Res.dolar, Res.euro, Res.uf, Res.ipc, Res.utm)
        setIndicadores(dataApi)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getInfoIndicadores()
  }, [])

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name='description' content='Home' />
      </Head>
      {indicadores ? (
        indicadores.map((x, idx) => {
          const date = x.fecha.split('T')[0].split('-')

          return (
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'end' }} key={idx}>
              <CardStatisticsHorizontal
                key={x.codigo}
                stats={x.valor}
                title={x.nombre}
                icon={
                  x.codigo == 'dolar' ? (
                    <AttachMoney />
                  ) : x.codigo == 'euro' ? (
                    <Euro />
                  ) : x.codigo == 'ipc' ? (
                    <Person />
                  ) : x.codigo == 'uf' ? (
                    <LocalAtm />
                  ) : x.codigo == 'utm' ? (
                    <Archive />
                  ) : null
                }
                trendNumber={`${date[2]}-${date[1]}-${date[0]}`}
              />
            </Box>
          )
        })
      ) : (
        <UserSpinner />
      )}
    </>
  )
}

Home.acl = {
  action: 'read',
  subject: 'ADM'
}

export default Home
