// ** Icon imports
import { HomeOutline, AccountGroupOutline } from 'mdi-material-ui'
import TimelineIcon from '@mui/icons-material/Timeline'
import AssignmentIcon from '@mui/icons-material/Assignment'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import { NavGroup, NavLink, VerticalNavItemsType } from 'src/@core/layouts/types'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

const MenuTickets = () => {
  const auth = useAuth()
  const [areas, setAreas] = useState<NavLink[]>([])
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)
  const listadoMenu = rolUsuario === 'admin' ? [1, 3] : rolUsuario === 'trabajador' ? [1,2,3] : [1,3]

  useEffect(() => {
    let isMounted = true

    const getAreas = async () => {
      try {
        const list = listadoMenu
        const access = [] as NavLink[]
        const added = [] as number[]

        let name, url

        for (const area of list) {
          if (added.includes(area)) {
            continue
          }

          switch (area) {
            case 1:
              name = 'Ver Todos'
              url = '/gestor-itec/resumen-tickets/all-tickets'

              break

            case 2:
              name = 'Asignados'
              url = '/gestor-itec/resumen-tickets/tickets-asignados'

              break

            case 3:
              name = 'Área Tickets'
              url = '/gestor-itec/resumen-tickets/tickets-areas'

              break

            default:
              continue
          }

          added.push(area)

          access.push({
            action: 'read',
            subject: 'ADM',
            title: name,
            path: url
          })
        }

        setAreas(access)
      } catch (e) {
        console.error(e)
      }
    }

    if (isMounted) {
      getAreas()
    }

    return () => {
      isMounted = false
    }
  }, [auth])

  return areas
}

const MenuMantenedores = () => {
  const auth = useAuth()
  const [areas, setAreas] = useState<NavLink[]>([])

  useEffect(() => {
    let isMounted = true

    const getAreas = async () => {
      try {
        const list = [1, 2, 3]
        const access = [] as NavLink[]
        const added = [] as number[]

        let name, url

        for (const area of list) {
          if (added.includes(area)) {
            continue
          }

          switch (area) {
            case 1:
              name = 'Tablas Basicas'
              url = '/gestor-itec/mantenedores/tablas-basicas'

              break

            case 2:
              name = 'Usuarios'
              url = '/gestor-itec/mantenedores/usuarios'

              break

            default:
              continue
          }

          added.push(area)

          access.push({
            action: 'read',
            subject: 'ADM',
            title: name,
            path: url
          })
        }

        setAreas(access)
      } catch (e) {
        console.error(e)
      }
    }

    if (isMounted) {
      getAreas()
    }

    return () => {
      isMounted = false
    }
  }, [auth])

  return areas
}

const MenuReportes = () => {
  const auth = useAuth()
  const [areas, setAreas] = useState<NavLink[]>([])

  useEffect(() => {
    let isMounted = true

    const getAreas = async () => {
      try {
        const list = [1, 2, 3]
        const access = [] as NavLink[]
        const added = [] as number[]

        let name, url

        for (const area of list) {
          if (added.includes(area)) {
            continue
          }

          switch (area) {
            case 1:
              name = 'Tickets'
              url = '/gestor-itec/analiticas'

              break

            default:
              continue
          }

          added.push(area)

          access.push({
            action: 'read',
            subject: 'ADM',
            title: name,
            path: url
          })
        }

        setAreas(access)
      } catch (e) {
        console.error(e)
      }
    }

    if (isMounted) {
      getAreas()
    }

    return () => {
      isMounted = false
    }
  }, [auth])

  return areas
}

const navigation = (): VerticalNavItemsType => {
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)
  if (rolUsuario == 'admin') {
    return [
      {
        title: 'Inicio',
        icon: HomeOutline,
        path: '/home',
        subject: 'ADM',
        action: 'read'
      },
      {
        action: 'read',
        subject: 'ADM',
        title: 'Tickets',
        icon: AssignmentIcon,
        children: MenuTickets()
      }
      ,
      {
        title: 'Mantenedores',
        icon: HomeOutline,
        action: 'read',
        subject: 'ADM',
        children: MenuMantenedores()
      },
      {
        title: 'Reportes',
        icon: TimelineIcon,
        action: 'read',
        subject: 'ADM',
        children: MenuReportes()
      }
    ]
  } else {
    return [
      {
        title: 'Inicio',
        icon: HomeOutline,
        path: '/home',
        subject: 'ADM',
        action: 'read'
      },
      {
        action: 'read',
        subject: 'ADM',
        title: 'Tickets',
        icon: AssignmentIcon,
        children: MenuTickets()
      }
    ]
  }



}

export default navigation
