export const seleccinarColorActividad = () => {
  return 'success'
}

export const colorByGlosa = (nGlosa: string, tipo: string) => {
  if (tipo == 'estado') {
    switch (nGlosa) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '6':
        return 'info'

      case '5':
      case '11':
        return 'success'

      case '7':
      case '8':
      case '9':
      case '10':
        return 'error'

      default:
        return 'secondary'
    }
  } else if (tipo == 'estadoICM') {
    switch (nGlosa) {
      case '1':
      case '2':
      case '4':
      case '6':
      case '9':
      case '10':
      case '11':
      case '15':
        return 'warning'

      case '3':
      case '5':
      case '7':
      case '8':
      case '12':
      case '13':
      case '14':
      case '18':
      case '19':
      case '20':
      case '21':
        return 'error'

      case '16':
      case '17':
        return 'success'
      default:
        return 'secondary'
    }
  } else {
    return 'secondary'
  }
}
