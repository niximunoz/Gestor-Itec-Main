import { NextApiRequest, NextApiResponse } from 'next/types'
import { instanceMiddlewareApi } from 'src/axios'
import bcrypt from 'bcryptjs'


const handleLoginMiddle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const login = req.body
    const secret_string = 'ExD1urn0s'
    const day = '2023-01-03'
    const secret_base64 = bcrypt.hashSync(secret_string, parseInt(process.env.SALT_ROUNDS!))
    const password_base64 = Buffer.from(login.Pwd, 'utf-8').toString('base64')
    const execution_base64 = Buffer.from(day, 'utf-8').toString('base64')
    const finalPostPassword = `${secret_base64}-${password_base64}-${execution_base64}`
    const newDataRes = {
      Email: login.Email,
      Pwd: finalPostPassword
    }

    const { data } = await instanceMiddlewareApi.post('/Auth/Login', newDataRes)
    if (data.Data) return res.status(200).json({ ...data.Data })

    return res.status(201).end('Error al ingresar')

  } catch (error: any) {
    return res.status(error.status || 500).end(error.message)
  }
}

export default handleLoginMiddle
