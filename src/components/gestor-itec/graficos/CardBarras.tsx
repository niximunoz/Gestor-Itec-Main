// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import format from 'date-fns/format'
import { ApexOptions } from 'apexcharts'
import DatePicker from 'react-datepicker'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'
import ChevronDown from 'mdi-material-ui/ChevronDown'

// ** Types
export type DateType = Date | null | undefined

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

interface PickerProps {
    start: Date | number
    end: Date | number
}
type Props = {
    asignado: number
    noasignado: number
  }

const CardBarras = ({ asignado, noasignado }: Props) => {
    const total = 'Total Tickets ' + (asignado + noasignado);

    const options: ApexOptions = {
        chart: {
            parentHeightOffset: 0,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                barHeight: '30%',
                horizontal: true,
                startingShape: 'rounded'
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                }
            },
            padding: {
                top: -10
            }
        },
        colors: ['#00cfe8'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Asignado', 'No asignado']
        }
    }

    const series = [
        {
            data: [asignado, noasignado]
        }
    ]

    return (
        <Card sx={{ mb: 5, position: 'relative' }}>
            <CardHeader
                title= {total}
                subheader= 'visualización de asignacion de tickets'
                titleTypographyProps={{ variant: 'h6' }}
                subheaderTypographyProps={{ variant: 'caption' }}
                sx={{
                    flexDirection: ['column', 'row'],
                    alignItems: ['flex-start', 'center'],
                    '& .MuiCardHeader-action': { mb: 0 },
                    '& .MuiCardHeader-content': { mb: [2, 0] }
                }}
                
            />
            <CardContent>
                <ReactApexcharts options={options} series={series} type='bar' height={400} />
            </CardContent>
        </Card>
    )
}

export default CardBarras
