import { Dispatch, SetStateAction } from "react"
import { ITblCategorias, ITblEstados } from "src/interfaces"

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type TokenDataType = {
  Token: string
  Expiracion: Date
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
  token?: string
  jwtTokenPermissions?: string
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  token: TokenDataType | null
  setToken: (value: TokenDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType, setCargando?: Dispatch<SetStateAction<boolean>>) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}

export type ParamsValueType = {
  listadoCategorias: ITblCategorias[] | null
  setListadoCategorias: (value: ITblCategorias[] | null) => void
  listadoEstados: ITblEstados[] | null
  setListadoEstados: (value: ITblEstados[] | null) => void
}