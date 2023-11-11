import { GridCellEditCommitParams, GridCellParams, GridRowId } from '@mui/x-data-grid-premium'
import { Dispatch, SetStateAction } from 'react'

export const seleccinarColor = (params: GridCellParams) => {
  if (params.value === 'Urgente') return 'prioridaUrgente'
  else if (params.value === 'Alta') return 'prioridaAlta'
  else if (params.value === 'Media') return 'prioridadMedia'
  else if (params.value === 'Baja') return 'prioridadBaja'

  return 'sinPrioridad'
}

export const seleccinarColorString = (params: string) => {
  if (params === 'Urgente') return 'prioridaUrgente'
  else if (params === 'Alta') return 'prioridaAlta'
  else if (params === 'Media') return 'prioridadMedia'
  else if (params === 'Baja') return 'prioridadBaja'

  return 'sinPrioridad'
}

export const seleccinarColorPorNumero = (params: GridCellParams) => {
  if (params.value == 1) return 'prioridaUrgente'
  else if (params.value == 2) return 'prioridaAlta'
  else if (params.value == 3) return 'prioridadMedia'
  else if (params.value == 4) return 'prioridadBaja'

  return 'sinPrioridad'
}

export const seleccinarPrioridadPorNumero = (params: GridCellParams) => {
  if (params.value == 1) return 'Urgente'
  else if (params.value == 2) return 'Alta'
  else if (params.value == 3) return 'Media'
  else if (params.value == 4) return 'Baja'

  return '-'
}

export const ordenarPrioridad = (a: any, b: any) => {
  if (a === b) return 0
  else if (a === 'Baja' && b === 'Media') return 1
  else if (a === 'Baja' && b === 'Alta') return 1
  else if (a === 'Baja' && b === 'Urgente') return 1
  else if (a === 'Media' && b === 'Alta') return 1
  else if (a === 'Media' && b === 'Urgente') return 1
  else if (a === 'Alta' && b === 'Urgente') return 1

  return -1
}

const FormatoFecha: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}

const FormatoFechaHora: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}

export const renderFecha = (fecha: Date) => {
  if (!fecha) {
    return ''
  }
  const fechaNueva = new Date(fecha).toLocaleDateString('es-ES', FormatoFecha)
  const hoy = Date.now()
  const fechaIngreso = new Date(fecha).getTime()
  const dias = (fechaIngreso - hoy) / (1000 * 60 * 60 * 24)

  return [fechaNueva, dias > 0 ? Math.ceil(dias) : parseInt(dias.toString())]
}

export const renderDias = (fecha: Date) => {
  if (!fecha) {
    return ''
  }
  const hoy = Date.now()
  const fechaIngreso = new Date(fecha).getTime()
  const dias = (fechaIngreso - hoy) / (1000 * 60 * 60 * 24)

  return dias > 0 ? Math.ceil(dias) : parseInt(dias.toString())
}

export const renderDiasPasados = (fecha: Date) => {
  if (!fecha) {
    return ''
  }
  const hoy = Date.now()
  const fechaIngreso = new Date(fecha).getTime()
  const dias = (fechaIngreso - hoy) / (1000 * 60 * 60 * 24)

  const cal = dias > 0 ? `${Math.ceil(dias)} Día/s` : `${parseInt(dias.toString())} Día/s`

  return cal
}

export const renderDiasPasadosNumber = (fecha: Date) => {
  if (!fecha) {
    return null
  }
  const hoy = Date.now()
  const fechaIngreso = new Date(fecha).getTime()
  const dias = (fechaIngreso - hoy) / (1000 * 60 * 60 * 24)

  const cal = dias > 0 ? Math.ceil(dias) : parseInt(dias.toString())

  return cal
}

export const renderDiasEntreFechas = (fecha: Date, fecha2: Date) => {
  if (!fecha || !fecha2) {
    return ''
  }
  const fechaIngreso = new Date(fecha).getTime()
  const fechaSalida = new Date(fecha2).getTime()
  const dias = (fechaSalida - fechaIngreso) / (1000 * 60 * 60 * 24)

  return dias > 0 ? Math.ceil(dias) : parseInt(dias.toString())
}

export const renderFormartFecha = (fecha: Date) => {
  return new Date(fecha).toLocaleDateString('es-ES', FormatoFecha)
}

export const renderFormartFechaHora = (fecha: Date) => {
  return new Date(fecha).toLocaleDateString('es-ES', FormatoFechaHora)
}

export const renderFormartFechaHoraEn = (fecha: Date) => {
  return new Date(fecha).toLocaleDateString('en-EN', FormatoFechaHora)
}

export const renderFormartFechaHoraMedica = (fecha: Date) => {
  const fechaHoraSplit = new Date(fecha).toLocaleDateString('es-ES', FormatoFechaHora).replace(" ", "").split(',');
  const fechaNew = fechaHoraSplit[0].split('/').reverse().join('-');
  const horaNew = (fechaHoraSplit[1].split(':')).slice(0, 2).join(":") + ':00';

  return `${fechaNew}T${horaNew}`
}

export const setRowUpdateDataGrid = (
  row: GridCellEditCommitParams,
  data: any[],
  arrayId: GridRowId[],
  setArrayId: Dispatch<SetStateAction<GridRowId[]>>,
  dataUpdate: any,
  setDataUpdate: Dispatch<SetStateAction<any[]>>
) => {
  const findId = arrayId.find(x => x === row.id)
  const field: string = row.field.toString()
  if (!findId) {
    setArrayId([...arrayId, row.id])
    const data_for_update: any = data.find(i => i.id === row.id)
    if (data_for_update) {
      data_for_update[field] = row.value
      setDataUpdate([...dataUpdate, data_for_update])
    }
  } else {
    const data_for_update: any = dataUpdate.find((i: any) => i.id === row.id)
    if (data_for_update) {
      data_for_update[field] = row.value
    }
  }
}


export const formatFecha = (fecha: string) => {
  return fecha.split(" ")[0].split("-").reverse().join("-")
}

export const guardarId = (id: string, name: string) => {
  window.localStorage.setItem(name, id.toString())
}

/** Buscar */

export const escapeRegExp = (value: string): string => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}