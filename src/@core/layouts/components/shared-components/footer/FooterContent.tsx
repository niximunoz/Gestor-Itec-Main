// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
      <Typography sx={{ mr: 2 }}>
        {`Creado con `}
        <Box className='heart' sx={{ whiteSpace: 'nowrap' }}>
          ❤️
        </Box>
        {` por `}
        <Link target='_blank' href='#'>
          Ex-Diurnos
        </Link>
      </Typography>
      <Typography variant='caption'>
        <Link href='#'>{process.env.BUILD_VERSION || '-'}</Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
