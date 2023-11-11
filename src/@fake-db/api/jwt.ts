// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'
import { instanceMiddleware } from 'src/axios'

const users: any[] = [
  {
    id: 1,
    role: 'admin',
    password: 'admin',
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'admin@materialize.com'
  },
  {
    id: 2,
    role: 'client',
    password: 'client',
    fullName: 'Jane Doe',
    username: 'janedoe',
    email: 'client@materialize.com'
  },
  {
    id: 632,
    role: 'adminv2',
    password: 'admin',
    fullName: 'vicente alvarez',
    username: 'valvarez',
    email: 'valvarez@isapredecodelco.cl'
  }
]

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

mock.onPost('/jwt/register').reply(request => {
  if (request.data.length > 0) {
    const { email, password, username } = JSON.parse(request.data)
    const isEmailAlreadyInUse = users.find(user => user.email === email)
    const isUsernameAlreadyInUse = users.find(user => user.username === username)
    const error = {
      email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
      username: isUsernameAlreadyInUse ? 'This username is already in use.' : null
    }

    if (!error.username && !error.email) {
      const { length } = users
      let lastIndex = 0
      if (length) {
        lastIndex = users[length - 1].id
      }
      const userData = {
        id: lastIndex + 1,
        email,
        password,
        username,
        avatar: null,
        fullName: '',
        role: 'admin'
      }

      users.push(userData)

      const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret!)

      const user = { ...userData }
      delete user.password

      const response = { accessToken }

      return [200, response]
    }

    return [200, { error }]
  } else {
    return [401, { error: 'Invalid Data' }]
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
