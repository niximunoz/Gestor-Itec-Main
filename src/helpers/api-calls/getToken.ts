
import { instanceMiddleware } from '../../axios'
import { getUser } from './getUser'

export const getToken = async (proyecto: string) => {
  try {
    const userAccess = getUser(proyecto)

    const { data: DataToken } = await instanceMiddleware.post(`/Auth/Token`, userAccess)

    return { token: DataToken.Token, expiracion: DataToken.Expiracion }
  } catch (error: any) {
    console.log('Descripción error:', error)

    return { token: null, expiracion: null }
  }
}