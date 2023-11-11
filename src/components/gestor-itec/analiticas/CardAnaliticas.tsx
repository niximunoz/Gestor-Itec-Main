import { Autocomplete, Grid, TextField } from '@mui/material'
import CardStats from './CardStats'
import { encryptText } from 'src/helpers'
import { instanceMiddlewareApi } from 'src/axios'
import { SyntheticEvent, useState } from 'react'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ITblTicket, ITblUsuario } from 'src/interfaces'
import { ModalTablaTickets } from './ModalTablaTickets'

type Props = {
  listadoUsuarios: ITblUsuario[]
}
export const CardAnaliticas = ({ listadoUsuarios }: Props) => {
  const [cargando, setCargando] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<ITblUsuario | null>(null)
  const [cantidadCreadas, setCantidadCreadas] = useState<number>(0)
  const [cantidadAsignadas, setCantidadAsignadas] = useState<number>(0)
  const [listadoTicketsCreados, setListadoTicketsCreados] = useState<ITblTicket[]>([])
  const [listadoTicketsAsignados, setListadoTicketsAsignados] = useState<ITblTicket[]>([])

  const cargarGraficas = async (rut: string) => {
    try {
      setCargando(true)
      const { data: ticketsCreados } = await instanceMiddlewareApi.post(`/Parametros/ObtenerCountAllTicketsUser`, {
        IdConsulta: encryptText(rut)
      })

      const { data: ticketsAsignados } = await instanceMiddlewareApi.post(`/Parametros/ObtenerCountAsignadosTicketsUser`, {
        IdConsulta: encryptText(rut)
      })

      if (ticketsCreados.Information.StatusCode == 200) {
        setCantidadCreadas(ticketsCreados.Data.Cantidad ?? 0)
        setListadoTicketsCreados(ticketsCreados.Data.ListadoTickets ?? [])
      }

      if (ticketsAsignados.Information.StatusCode == 200) {
        setCantidadAsignadas(ticketsAsignados.Data.Cantidad ?? 0)
        setListadoTicketsAsignados(ticketsAsignados.Data.ListadoTickets ?? [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const handleChangeUsuario = async (event: SyntheticEvent, newValue: ITblUsuario | null) => {
    setSelectedUser(newValue ?? null)
    if (newValue != null) {
      await cargarGraficas(newValue.UsuRut)
    }
  }

  return cargando ? (
    <UserSpinner />
  ) : (
    <>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={12}>
        <Autocomplete
          filterSelectedOptions
          id='divisiones-autocomplete'
          options={listadoUsuarios}
          getOptionLabel={option => `${option.UsuNombre ?? ''}  ${option.UsuApellido ?? ''}` ?? ''}
          value={selectedUser}
          onChange={handleChangeUsuario}
          renderInput={params => (
            <TextField {...params} label='Selecciona un Usuario' variant='outlined' sx={{ width: '300px' }} />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.UsuId}>
                {option.UsuNombre} {option.UsuApellido}
              </li>
            )
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <CardStats
          data={{
            stats: `${cantidadCreadas}`,
            trend: 'negative',
            title: 'Tickets Creados',
            chipColor: 'success',
            trendNumber: '-25.5%',
            chipText: 'Last Month',
            src: '/images/cards/card-stats-img-1.png'
          }}
          listaDatosTickets={listadoTicketsCreados ?? []}
          listaDatosUsuarios={listadoUsuarios ?? []}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <CardStats
          data={{
            stats: `${cantidadAsignadas}`,
            trend: 'negative',
            title: 'Tickets Asignados',
            chipColor: 'success',
            trendNumber: '-25.5%',
            chipText: 'Last Month',
            src: '/images/cards/card-stats-img-2.png'
          }}
          listaDatosTickets={listadoTicketsAsignados ?? []}
          listaDatosUsuarios={listadoUsuarios ?? []}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <CardStats
          data={{
            stats: `${cantidadAsignadas}`,
            trend: 'negative',
            title: 'Tickets Abiertos',
            chipColor: 'success',
            trendNumber: '-25.5%',
            chipText: 'Last Month',
            src: '/images/cards/card-stats-img-3.png'
          }}
          listaDatosTickets={listadoTicketsAsignados ?? []}
          listaDatosUsuarios={listadoUsuarios ?? []}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <CardStats
          data={{
            stats: `${cantidadAsignadas}`,
            trend: 'negative',
            title: 'Tickets En Proceso',
            chipColor: 'success',
            trendNumber: '-25.5%',
            chipText: 'Last Month',
            src: '/images/cards/card-stats-img-3.png'
          }}
          listaDatosTickets={listadoTicketsAsignados ?? []}
          listaDatosUsuarios={listadoUsuarios ?? []}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <CardStats
          data={{
            stats: `${cantidadAsignadas}`,
            trend: 'negative',
            title: 'Tickets Cerrados',
            chipColor: 'success',
            trendNumber: '-25.5%',
            chipText: 'Last Month',
            src: '/images/cards/card-stats-img-4.png'
          }}
          listaDatosTickets={listadoTicketsAsignados ?? []}
          listaDatosUsuarios={listadoUsuarios ?? []}
        />
      </Grid>

      </Grid>
    </>
  )
}
