import { Avatar, Box, Typography } from '@mui/material'
import { ITblDetalleTicket, ITblUsuario } from 'src/interfaces'
import { styled } from '@mui/material/styles'
import {
  TimelineContent,
  TimelineItem,
  TimelineProps
} from '@mui/lab'
import MuiTimeline from '@mui/lab/Timeline'
import { renderFormartFecha } from 'src/helpers'

type Props = {
  detalleTicket: ITblDetalleTicket[] | null
  listaDatosUsuarios: ITblUsuario[]
}
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

export const TimeLineDetalleTicket = ({ detalleTicket, listaDatosUsuarios }: Props) => {

  const getUsuario = (userCreaId: number) => {
    const usuario = listaDatosUsuarios.find(user => user.UsuId === userCreaId)
    console.log(usuario)
    return usuario
  }

  return (
    <Timeline
      sx={{
        my: 2,
        py: 0,
        m: 5,
        ml: 5
      }}
    >
      {detalleTicket?.map((b: ITblDetalleTicket) => {
        const usuario = getUsuario(b.UserCreaId);

        return (
          <TimelineItem key={b.DetalleTicketId}>
            <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex' }}>
                    {usuario ? (
                      <>
                        <Avatar src={'/images/avatars/3.png'} sx={{ width: '2rem', height: '2rem', mr: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {usuario.UsuNombre} {usuario.UsuApellido}
                          </Typography>
                          <Typography variant='caption'>Autor</Typography>
                        </Box>
                      </>
                    ) : null}
                  </Box>
                </Box>
                <Typography sx={{ mr: 2, fontWeight: 600 }}>
                  {renderFormartFecha(b.FechaCreacion)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600, maxWidth: '300px', whiteSpace: 'break-word' }}>
                  {b.DetalleTicketDescripcion}
                </Typography>
              </Box>


            </TimelineContent>
          </TimelineItem>
        );
      })}

      
    </Timeline>
  )
}
