// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

//** JWT */
import jwt from 'jsonwebtoken'
import UserSpinner from 'src/layouts/components/UserSpinner'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else return '/home'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user && auth.user.token) {
      const decode: any = jwt.decode(auth.user.token)
      const role = decode.role
      const homeRoute = getHomeRoute(role)

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

    
  }, [])

  return <UserSpinner />
}

export default Home
