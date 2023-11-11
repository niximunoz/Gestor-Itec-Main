// ** Icon imports
import { 
  HomeOutline, 
  ShieldOutline,
  FileOutline
} from 'mdi-material-ui';

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Inicio',
    icon: HomeOutline,
    path: '/home'
  },
  {
    title: 'OCM',
    icon: FileOutline,
    path: '/ocm'
  },
  {
    title: 'Control Acceso',
    icon: ShieldOutline,
    path: '/acl',
    action: 'read',
    subject: 'acl-page'
  }
]

export default navigation
