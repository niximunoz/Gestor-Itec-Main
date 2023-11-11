// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import { CardStatsCharacterProps } from 'src/@core/components/card-statistics/types'
import { CardHeader } from '@mui/material'
import { ModalTablaTickets } from './ModalTablaTickets'
import { ITblTicket, ITblUsuario } from 'src/interfaces'

interface Props {
  data: CardStatsCharacterProps
  listaDatosTickets: ITblTicket[]
  listaDatosUsuarios: ITblUsuario[]
}

const CardStats = ({ data,listaDatosTickets,listaDatosUsuarios }: Props) => {
  // ** Vars
  const { title, chipColor, chipText, src, stats, trend, trendNumber } = data

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardHeader
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        title={title}
        action={
          <ModalTablaTickets 
            listaDatosTickets={listaDatosTickets ?? []} 
            listaDatosUsuarios={listaDatosUsuarios ?? []} 
          />
        }
      />
      <CardContent sx={{ pb: '0 !important' }}>
        <Grid container>
          <Grid item xs={6}>
            <CustomChip
              skin='light'
              size='small'
              label={chipText}
              color={chipColor}
              sx={{ mb: 5.5, height: 20, fontWeight: 500, fontSize: '0.75rem' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h5' sx={{ mr: 1.5 }}>
                {stats}
              </Typography>
              <Typography variant='caption' sx={{ color: trend === 'negative' ? 'error.main' : 'success.main' }}>
                {trendNumber}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <img src={src} alt={title} height={134} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardStats

CardStats.defaultProps = {
  trend: 'positive',
  chipColor: 'primary'
}
