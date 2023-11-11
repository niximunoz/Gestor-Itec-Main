// ** MUI Import
import Box from '@mui/material/Box'

const UserSpinner = () => {

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box
        component='img'
        alt='imagen de carga'
        src={'/images/buffering-colors.gif'}
        sx={{
          height: 100,
          width: 100
        }}
      >
      </Box>
    </Box>
  )
}

export default UserSpinner
