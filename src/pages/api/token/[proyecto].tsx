import { NextApiRequest, NextApiResponse } from 'next/types'
import { instanceMiddlewareApi } from 'src/axios'
import jwt from 'jsonwebtoken'
import { getUser } from 'src/helpers'

const getToken = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: any = req.body
    const proyecto: string = req.query.proyecto as string
    if (!!body?.Token && new Date(body?.Expiracion) > new Date() && proyecto == body?.Proyecto) {
      const newToken = jwt.decode(body.Token, { complete: true })

      return res.status(200).json({ Token: newToken?.payload, Expiracion: null })
    } else {
      const userAccess = getUser(proyecto);
      const { data: DataToken } = await instanceMiddlewareApi.post(
        `/Auth/Token`, userAccess
      )

      const newToken = { Token: DataToken.Data.Token, Expiracion: DataToken.Data.Expiracion, Proyecto: body?.Proyecto }

      return res.status(200).json(newToken)
    }
  } catch (error: any) {
    console.log("error",error)
    
    return res.status(401).json({ Token: null, Expiracion: null })
  }
}

export default getToken
