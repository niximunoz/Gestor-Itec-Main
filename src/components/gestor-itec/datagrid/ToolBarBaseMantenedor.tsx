// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarContainer } from '@mui/x-data-grid-premium'
import { FileUpload } from '@mui/icons-material'

import Close from 'mdi-material-ui/Close'
import Magnify from 'mdi-material-ui/Magnify'
import { Button } from '@mui/material'



interface Props {
  value: string
  clearSearch: () => void
  onChange: (e: ChangeEvent) => void
  obtener: JSX.Element
  exportToCSV: () => void
}

const StyledGridToolbarContainer = styled(GridToolbarContainer)({
  //m: '5',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 5 
})

export const ToolBarBaseMantenedor = (props: Props) => {


  return (
    <StyledGridToolbarContainer>
      <Box sx={{ display: 'flex' }}>
        <Box>
          <Button variant='outlined' color='primary' onClick={props.exportToCSV}>
            <FileUpload /> Exportar
          </Button>
        </Box>
        <Box sx={{ ml: 2 }}>
          { props.obtener }
        </Box>
      </Box>
      <Box>
        <TextField
          variant='standard'
          value={props.value}
          onChange={props.onChange}
          placeholder='Buscar'
          InputProps={{
            startAdornment: <Magnify fontSize='small' />,
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <Close fontSize='small' />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            m: theme => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5
            },
            '& .MuiInput-underline:before': {
              borderBottom: 1,
              borderColor: 'divider'
            }
          }}
        />
      </Box>
    </StyledGridToolbarContainer>
  )
}
