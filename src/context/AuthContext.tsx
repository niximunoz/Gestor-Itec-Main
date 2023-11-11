// ** React Imports
import { createContext, useEffect, useState, ReactNode, Dispatch } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { appUserSlice } from 'src/store/users'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType, TokenDataType } from './types'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  token: null,
  loading: true,
  setUser: () => null,
  setToken: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)
  const [token, setToken] = useState<TokenDataType | null>(defaultProvider.token)
  let timeout: NodeJS.Timeout | null = null

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            const token = window.localStorage.getItem(authConfig.storageTokenKeyName)
            const jsonToken = { Token: response.data.userData.token, Expiracion: response.data.userData.expiracion }
            setToken(jsonToken)
            const user = { ...response.data.userData, token }
            console.log(user)
            setUser(user)

            /** Dispach para redux */
            dispatch(appUserSlice.actions.login(user))
            setLoading(false)
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setToken(null)
            setLoading(false)
          })
      } else {
        setIsInitialized(false)
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
    setCargando?: Dispatch<React.SetStateAction<boolean>>
  ) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async res => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })
          .then(async response => {
            const token = window.localStorage.getItem(authConfig.storageTokenKeyName)
            const jsonToken = { Token: response.data.userData.token, Expiracion: response.data.userData.expiracion }
            setToken(jsonToken)
            const user = { ...response.data.userData, token }
            delete user.tokenAcceso
            delete user.expiracion
            setUser(user)
            window.localStorage.setItem(authConfig.userData, JSON.stringify(user))

            //Dispach para redux
            dispatch(appUserSlice.actions.login({ ...response.data, token }))

            const returnUrl = router.query.returnUrl
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL as string)
            if (setCargando) {
              setCargando(false)
            }
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  useEffect(() => {
    restartAutoReset()
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
        window.removeEventListener('mousemove', onMouseMove)
      }
    }
  }, [router.pathname])

  const restartAutoReset = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      Swal.fire({
        title: 'Cuenta inactiva',
        text: 'Sesión Cerrada',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0098aa'
      }).then(() => {
        handleLogout()
      })
    }, 3600000)
  }

  const onMouseMove = () => {
    restartAutoReset()
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    setIsInitialized(false)
    window.localStorage.clear()
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    token,
    loading,
    setUser,
    setToken,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
