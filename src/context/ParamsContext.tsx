// ** React Imports
import {createContext, useState, ReactNode, useEffect, useMemo, useCallback} from 'react'
import {ITblCategorias, ITblEstados} from 'src/interfaces'

// ** Types
import {ParamsValueType} from './types'
import {useAuth} from '../hooks/useAuth'
import { instanceMiddlewareApi } from 'src/axios'



// ** Defaults
const defaultProvider: ParamsValueType = {
  listadoEstados: [],
  setListadoEstados: () => null,

  listadoCategorias: [],
  setListadoCategorias: () => null,
}

const ParamsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ParamsProvider = ({children}: Props) => {
  // ** States
  const auth = useAuth()
  const [listadoCategorias, setListadoCategorias] = useState<ITblCategorias[] | null>(defaultProvider.listadoCategorias)
  const [listadoEstados, setListadoEstados] = useState<ITblEstados[] | null>(defaultProvider.listadoEstados)



  const obtenerParams = async () => {
    try {
        const { data: ListadoCategorias } = await instanceMiddlewareApi.get(`/Parametros/ObtenerListadoCategoriasTickets`)
        const { data: ListadoEstados } = await instanceMiddlewareApi.get(`/Parametros/ObtenerListadoEstadosTickets`)

        setListadoCategorias(ListadoCategorias.Data)
        setListadoEstados(ListadoEstados.Data)
    } catch (error: any) {
      console.error('Descripción error:', error)
    }
  }

  const memoizedCallback = useCallback(() => {
    obtenerParams()
  }, [
    listadoCategorias,
    listadoEstados
  ])

  useEffect(() => {
    if (
      !listadoCategorias ||
      listadoCategorias.length == 0 ||
      !listadoEstados ||
      listadoEstados.length == 0
    ) {
      if (auth.user) memoizedCallback()
    }
  }, [auth.user])

  const values = useMemo(
    () => ({
        listadoCategorias,
        setListadoCategorias,
        listadoEstados,
        setListadoEstados
    }),
    [
        listadoCategorias,
        listadoEstados
    ]
  )

  return <ParamsContext.Provider value={values}> {children} </ParamsContext.Provider>
}

export {ParamsContext, ParamsProvider}
