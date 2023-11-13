import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { ApexOptions } from 'apexcharts'

type Props = {
    asignado: number
    noasignado: number
  }

const CardBarras = ({ asignado, noasignado }: Props) => {
    const total = 'Total Tickets: ' + (asignado + noasignado);

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
                barHeight: '40%',
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
            enabled: true
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
        <Card>
            <CardHeader
                title= {total}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
                <ReactApexcharts options={options} series={series} type='bar' height={200} />
            </CardContent>
        </Card>
    )
}

export default CardBarras
