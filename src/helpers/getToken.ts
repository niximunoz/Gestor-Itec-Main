import { AuthValuesType } from "src/context/types"
import jwt from 'jsonwebtoken'
import { instanceMiddleware } from "src/axios"

export const validarToken = async (auth: AuthValuesType) => {
    if (!!auth.token?.Token && new Date(auth.token?.Expiracion) > new Date()) {
      const newToken = jwt.decode(auth.token.Token, { complete: true })
      
      return newToken?.payload
    }
  
    const { data: DataToken } = await instanceMiddleware.post(`/token/Token`, {
        ...auth.token
      })
    
    const { Token: tkn, Expiracion: exp } = DataToken
    if (exp) auth.setToken({ Token: jwt.sign(tkn, process.env.JWT_SECRET!), Expiracion: exp })
  
    return tkn
  }