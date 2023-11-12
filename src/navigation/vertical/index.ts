// ** Icon imports
import {
  HomeOutline,

  FileDocumentMultiple,
  AccountGroupOutline
} from 'mdi-material-ui';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      action: 'read',
      subject: 'ADM',
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      action: 'read',
      subject: 'ADM',
      title: 'Tickets',
      icon: AssignmentIcon,
      children: [
        {
          action: 'read',
          subject: 'ADM',
          title: 'Ver Todos',
          path: '/gestor-itec/resumen-tickets/all-tickets'
        },
        {
          action: 'read',
          subject: 'ADM',
          title: 'Asignados',
          path: '/gestor-itec/resumen-tickets/tickets-asignados'
        },
        {
          action: 'read',
          subject: 'ADM',
          title: 'Área Tickets',
          path: '/gestor-itec/resumen-tickets/tickets-areas'
        }
      ]
    },
    {
      title: 'Reportes',
      icon: TimelineIcon,
      children: [
        {
          title: 'Tickets',
          action: 'read',
          subject: 'ADM',
          path: '/gestor-itec/reportes'
        }
      ]
    },
    {
      title: 'Mantenedores',
      icon: HomeOutline,
      children: [
        {
          action: 'read',
          subject: 'ADM',
          title: 'Tablas Basicas',
          icon: AccountGroupOutline,
          path: '/gestor-itec/mantenedores/tablas-basicas'
        },
        {
          action: 'read',
          subject: 'ADM',
          title: 'Usuarios',
          icon: AccountGroupOutline,
          path: '/gestor-itec/mantenedores/usuarios'
        }
      ]
    },
    {
      action: 'read',
      subject: 'ADM',
      icon: QueryStatsIcon,
      path: '/gestor-itec/analiticas',
      title: 'Estadísticas'
    }
  ]
}

export default navigation
