// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { Bar } from 'react-chartjs-2'
import { useTheme } from '@mui/material/styles'

// ** Types
export type DateType = Date | null | undefined


// ** Third Party Styles Imports
import 'chart.js/auto'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
    datosGrafico: {
        nombre: string[];
        cantidad: number[];
    };
}

const CardBarraV = ({ datosGrafico }: Props) => {
    const nombre = datosGrafico['nombre'];
    const cantidad = datosGrafico['cantidad'];

    const theme = useTheme()
    const borderColor = theme.palette.action.focus
    const gridLineColor = theme.palette.action.focus
    const labelColor = theme.palette.text.primary

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        scales: {
            x: {
                grid: {
                    borderColor,
                    color: gridLineColor
                },
                ticks: { color: labelColor }
            },
            y: {
                min: 0,
                grid: {
                    borderColor,
                    color: gridLineColor
                },
                ticks: {
                    stepSize: 10,
                    color: labelColor
                }
            }
        },
        plugins: {
            legend: { display: false }
        }
    }

    const data = {
        labels: nombre,
        datasets: [
            {
                maxBarThickness: 15,
                backgroundColor: '#2c9aff',
                borderColor: 'transparent',
                borderRadius: { topRight: 15, topLeft: 15 },
                data: cantidad
            }
        ]
    }


    return (
        <Card sx={{ mb: 5, position: 'relative' }}>
            <CardHeader
                title='Estado de Tickets'
                titleTypographyProps={{ variant: 'h6' }}
                sx={{
                    flexDirection: ['column', 'row'],
                    alignItems: ['flex-start', 'center'],
                    '& .MuiCardHeader-action': { mb: 0 },
                    '& .MuiCardHeader-content': { mb: [2, 0] }
                }}
            />
            <CardContent>
                <Bar data={data} options={options} height={400} />
            </CardContent>
        </Card>
    )
}

export default CardBarraV
