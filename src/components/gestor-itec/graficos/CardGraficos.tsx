// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Grid } from '@mui/material'
import { Bar } from 'react-chartjs-2'
import { useTheme } from '@mui/material/styles'
import 'chart.js/auto'
import 'react-datepicker/dist/react-datepicker.css'
export type DateType = Date | null | undefined


const donutColors = {
  series1: '#00d4bd',
  series2: '#826bf8',
  series3: '#6495ed',
  series4: '#40CDFA',
  series5: '#fdd835'
}

interface Props {
  datosGrafico: {
    titulo: string;
    nombre: string[];
    cantidad: number[];
  };
}



const CardGraficos = ({ datosGrafico }: Props) => {
  const nombre = datosGrafico['nombre'];
  const cantidad = datosGrafico['cantidad'];
  const titulo = datosGrafico['titulo'];


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
                return '100%'
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
  //grafico de barras
  const theme = useTheme()
  const borderColor = theme.palette.action.focus
  const gridLineColor = theme.palette.action.focus
  const labelColor = theme.palette.text.primary

  const optionsb = {
    responsive: true,
    height: '400px',
    maintainAspectRatio: true,
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
        maxBarThickness: 20,
        backgroundColor: ['#00d4bd','#fdd835', '#6495ed'],
        borderColor: 'transparent',
        borderRadius: { topRight: 15, topLeft: 15 },
        data: cantidad
      }
    ]
  }

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader
        title={titulo}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent
        sx={{
          pt: theme => `${theme.spacing(2.5)} !important`,
          '& .apexcharts-canvas .apexcharts-pie .apexcharts-datalabel-label, & .apexcharts-canvas .apexcharts-pie .apexcharts-datalabel-value':
            { fontSize: '1.2rem' }
        }}
      >
        <Grid container spacing={5} >
          <Grid item xs={12} sm={6}>
            <ReactApexcharts options={options} series={series} type='donut' height={400} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Bar data={data} options={optionsb} height={340} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardGraficos

