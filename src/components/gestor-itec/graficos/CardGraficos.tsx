// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Dictionary } from '@reduxjs/toolkit'
import { ListClasses } from '@mui/material'

const donutColors = {
  series1: '#00d4bd',
  series2: '#826bf8',
  series3: '#6495ed',
  series4: '#40CDFA',
  series5: '#fdd835'
}

interface Props {
  datosGrafico: {
    nombre: string[];
    cantidad: number[];
  };
}



const CardGraficos = ({ datosGrafico }: Props) => {
  const nombre = datosGrafico['nombre'];
  const cantidad = datosGrafico['cantidad'];


  const options: ApexOptions = {
    legend: {
      show: true,
      position: 'bottom'
    },
    stroke: { width: 0 },
    labels: nombre,
    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter(val: string) {
        return `${parseInt(val, 10)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val: string) {
                return `${parseInt(val, 10)}`
              }
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: 'Total',
              formatter() {
                return '%'
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.5rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  const series = cantidad

  return (
    <Card sx={{ mb: 5, position: 'relative'}} >
      <CardHeader
        title='Estado de Tickets'
        titleTypographyProps={{ variant: 'h6' }}
        subheader='visualización del estado de los tickets'
        subheaderTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
      />
      <CardContent
        sx={{
          '& .apexcharts-canvas .apexcharts-pie .apexcharts-datalabel-label, & .apexcharts-canvas .apexcharts-pie .apexcharts-datalabel-value':
            { fontSize: '1.2rem' }
        }}
      >
        <ReactApexcharts options={options} series={series} type='donut' height={400} />
      </CardContent>
    </Card>
  )
}

export default CardGraficos
