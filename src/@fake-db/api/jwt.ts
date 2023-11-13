// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'
import { instanceMiddleware } from 'src/axios'

// ! These two secrets should be in .env file and not in any other file
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET
}

mock.onPost('/jwt/login').reply(async request => {
  const { email, password } = JSON.parse(request.data)

  const dataRes = {
    Email: email,
    Pwd: password
  }

  try {
    const { data, status } = await instanceMiddleware.post('/login', dataRes)

    if (status == 200) {
      const dataUserLocalStorage = {
        email: data.UsuEmail,
        fullName: `${data.UsuNombre} ${data.UsuApellido}`,
        id: data.UsuId,
        usuRut: data.UsuRut,
        usuRol: data.UsuRol,
        role: data.UsuRol,
        username: data.UsuEmail,
        password: data.UsuPasswordHash,
        token: null,
        expiracion: null
      }
      
      const accessToken = jwt.sign(dataUserLocalStorage, jwtConfig.secret!)

      const response = {
        accessToken
      }

      return [200, response]
    } else {
      const error = {
        email: ['email or Password is Invalid']
      }
      
      return [status, { error }]
    }
  } catch (err) {
    return [400, { err }]
  }
})
mock.onGet('/auth/me').reply(config => {
  // @ts-ignore
  const token = config.headers.Authorization as string

  // get the decoded payload and header
  const decoded = jwt.decode(token, { complete: true })

  if (decoded) {
    // @ts-ignore
    const userData: JwtPayload = decoded.payload
    userData.role = jwt.sign({ role: userData.role }, jwtConfig.secret!)
    delete userData.password
    delete userData.iat

    return [200, { userData }]
  } else {
    return [401, { error: { error: 'Invalid User' } }]
  }
})
