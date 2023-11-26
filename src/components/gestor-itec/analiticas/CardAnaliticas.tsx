import { Autocomplete, Grid, TextField } from '@mui/material'
import CardStats from './CardStats'
import { encryptText } from 'src/helpers'
import { instanceMiddlewareApi } from 'src/axios'
import { SyntheticEvent, useEffect, useState } from 'react'
import UserSpinner from 'src/layouts/components/UserSpinner'
import { ITblTicket, ITblUsuario } from 'src/interfaces'

type Props = {
  listadoUsuarios: ITblUsuario[]
  dataCargaInicial: any
}
export const CardAnaliticas = ({ listadoUsuarios,dataCargaInicial }: Props) => {
  const [cargando, setCargando] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<ITblUsuario | null>(null)
  const [cantidadCreadas, setCantidadCreadas] = useState<number>(0)
  const [cantidadAsignadas, setCantidadAsignadas] = useState<number>(0)
  const [listadoTicketsCreados, setListadoTicketsCreados] = useState<ITblTicket[]>([])
  const [listadoTicketsAsignados, setListadoTicketsAsignados] = useState<ITblTicket[]>([])

  const [cantidadTicketsAsigAbiertos, setCantidadTicketsAsigAbiertos] = useState<number>(0)
  const [cantidadTicketsAsigCerrados, setCantidadTicketsAsigCerrados] = useState<number>(0)
  const [cantidadTicketsAsigEnProceso, setCantidadTicketsAsigEnProceso] = useState<number>(0)
  const [listadoTicketsAsigAbiertos, setListadoTicketsAsigAbiertos] = useState<ITblTicket[]>([])
  const [listadoTicketsAsigCerrados, setListadoTicketsAsigCerrados] = useState<ITblTicket[]>([])
  const [listadoTicketsAsigEnProceso, setLstadoTicketsAsigEnProceso] = useState<ITblTicket[]>([])

  const cargarGraficas = async (rut: string, rol : string | null) => {
    try {
      setCargando(true)
      const { data: ListadoTicketsFullRutUser } = await instanceMiddlewareApi.post(
        `/Parametros/ObtenerCountTicketsGeneralByRutUsuario`,
        {
          IdConsulta: encryptText(rut)
        }
      )

      setCantidadTicketsAsigAbiertos(ListadoTicketsFullRutUser.Data.CantidadAbiertos ?? 0)
      setCantidadTicketsAsigCerrados(ListadoTicketsFullRutUser.Data.CantidadCerrados ?? 0)
      setCantidadTicketsAsigEnProceso(ListadoTicketsFullRutUser.Data.CantidadEnProceso ?? 0)
      setListadoTicketsAsigAbiertos(ListadoTicketsFullRutUser.Data.ListadoTicketsAbiertos ?? [])
      setListadoTicketsAsigCerrados(ListadoTicketsFullRutUser.Data.ListadoTicketsCerrados ?? [])
      setLstadoTicketsAsigEnProceso(ListadoTicketsFullRutUser.Data.ListadoTicketsEnProceso ?? [])

      if (rol == 'trabajador') {
        setCantidadCreadas(ListadoTicketsFullRutUser.Data.CantidadTicketCreadosTrabajador ?? 0)
        setListadoTicketsCreados(ListadoTicketsFullRutUser.Data.ListadoTicketsCreadosTrabajador ?? [])
        setCantidadAsignadas(ListadoTicketsFullRutUser.Data.CantidadTicketAsignadosTrabajador ?? 0)
        setListadoTicketsAsignados(ListadoTicketsFullRutUser.Data.ListadoTicketsAsignadosTrabajador ?? [])
      }

      if (rol == 'cliente') {
        setCantidadCreadas(ListadoTicketsFullRutUser.Data.CantidadTicketCreadoCliente ?? 0)
        setListadoTicketsCreados(ListadoTicketsFullRutUser.Data.ListadoTicketsCreadosCliente ?? [])
        setCantidadAsignadas(ListadoTicketsFullRutUser.Data.CantidadTicketAsignadosCliente ?? 0)
        setListadoTicketsAsignados(ListadoTicketsFullRutUser.Data.ListadoTicketsAsignadosCliente ?? [])
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
      await cargarGraficas(newValue.UsuRut.toString(), newValue.UsuRol)
    }
  }

  useEffect(() => {
    setCantidadTicketsAsigAbiertos(dataCargaInicial.Data.CantidadAbiertos ?? 0)
      setCantidadTicketsAsigCerrados(dataCargaInicial.Data.CantidadCerrados ?? 0)
      setCantidadTicketsAsigEnProceso(dataCargaInicial.Data.CantidadEnProceso ?? 0)
      setListadoTicketsAsigAbiertos(dataCargaInicial.Data.ListadoTicketsAbiertos ?? [])
      setListadoTicketsAsigCerrados(dataCargaInicial.Data.ListadoTicketsCerrados ?? [])
      setLstadoTicketsAsigEnProceso(dataCargaInicial.Data.ListadoTicketsEnProceso ?? [])

      setCantidadCreadas(dataCargaInicial.Data.CantidadTicketNoAsignadosGeneral ?? 0)
        setListadoTicketsCreados(dataCargaInicial.Data.ListadoTicketsNoAsignadosGeneral ?? [])
        setCantidadAsignadas(dataCargaInicial.Data.CantidadTicketAsignadosGeneral ?? 0)
        setListadoTicketsAsignados(dataCargaInicial.Data.ListadoTicketsAsignadosGeneral ?? [])
  }, [dataCargaInicial])
  

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
              trendNumber: '',
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
              trendNumber: '',
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
              stats: `${cantidadTicketsAsigAbiertos}`,
              trend: 'negative',
              title: 'Tickets Abiertos',
              chipColor: 'success',
              trendNumber: '',
              chipText: 'Last Month',
              src: '/images/cards/card-stats-img-3.png'
            }}
            listaDatosTickets={listadoTicketsAsigAbiertos ?? []}
            listaDatosUsuarios={listadoUsuarios ?? []}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <CardStats
            data={{
              stats: `${cantidadTicketsAsigEnProceso}`,
              trend: 'negative',
              title: 'Tickets En Proceso',
              chipColor: 'success',
              trendNumber: '',
              chipText: 'Last Month',
              src: '/images/cards/card-stats-img-3.png'
            }}
            listaDatosTickets={listadoTicketsAsigEnProceso ?? []}
            listaDatosUsuarios={listadoUsuarios ?? []}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <CardStats
            data={{
              stats: `${cantidadTicketsAsigCerrados}`,
              trend: 'negative',
              title: 'Tickets Cerrados',
              chipColor: 'success',
              trendNumber: '',
              chipText: 'Last Month',
              src: '/images/cards/card-stats-img-4.png'
            }}
            listaDatosTickets={listadoTicketsAsigCerrados ?? []}
            listaDatosUsuarios={listadoUsuarios ?? []}
          />
        </Grid>
      </Grid>
    </>
  )
}
