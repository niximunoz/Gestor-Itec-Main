// ** Icon imports
import {
  HomeOutline,

  FileDocumentMultiple,
  AccountGroupOutline
} from 'mdi-material-ui'
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
      title: 'Gestor Itec',
      icon: FileDocumentMultiple,
      children: [
        {
          action: 'read',
          subject: 'ADM',
          path: '/gestor-itec/analiticas',
          title: 'Analiticas Itec'
        },
        {
          action: 'read',
          subject: 'ADM',
          title: 'Atención de Tickets',
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
              title: 'Ver Asignados',
              path: '/gestor-itec/resumen-tickets/tickets-asignados'
            },
            {
              action: 'read',
              subject: 'ADM',
              title: 'Ver Areas',
              path: '/gestor-itec/resumen-tickets/tickets-areas'
            }
          ]
        },
        {
          title: 'Reportes',
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
          children: [
            {
              action: 'read',
              subject: 'ADM',
              title: 'Tablas Basicas',
              icon: AccountGroupOutline,
              path: '/gestor-itec/mantenedores'
            }
          ]
        }
      ]
    }
  ]
}

export default navigation
