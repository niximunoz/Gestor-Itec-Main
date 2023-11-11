import { format } from "date-fns";


// Retorna formato fecha YYYYMM (202301)
export const formatDateYearMonth = (date:Date = new Date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    return [year,month].join('');
}




export const formatDateYearMonthAddMonth = (date:Date = new Date, addMonth: number = 1) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + addMonth),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    return [year,month].join('');
}



export const formatDateYearMonthAddMonthV2 = (fecha: any, addMonth: any = 1) => {
    const Fecha = fecha.toString().concat('01')
    const yearExtract = Fecha.substring(0, 4);
    const monthExtract = Fecha.substring(4, 6);
    const dayExtract = Fecha.substring(6, 8);
    const FechaFormateada = [monthExtract, dayExtract , yearExtract].join('-')            
    const newFechaFormat = new Date(FechaFormateada)                  
    const nuevaFecha = new Date(newFechaFormat.setMonth(newFechaFormat.getMonth()+addMonth))     

    let d = new Date(nuevaFecha),
        month = '' +(d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    return [year, month].join('');
}


export const formatDateYearMonthSubtractMonth = (fecha: number, Month: any = 1) => {
    let date = new Date(fecha/100, fecha%100-1, 1);
   date.setMonth(date.getMonth() - 1);
  return  date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2)
}

export const formatearFecha = (fecha: Date = new Date()) => {
    const date = new Date(fecha); // Obtener la fecha actual
    const year = date.getFullYear(); // Obtener el año
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes y agregar un cero delante si es necesario
    const day = String(date.getDate()).padStart(2, '0'); // Obtener el día y agregar un cero delante si es necesario
    const dateString = `${day}-${month}-${year}`
    
    return dateString
}

export const formatearFechaFull = (fecha: Date = new Date()) => {
    const date = new Date(fecha); // Obtener la fecha actual
    const year = date.getFullYear(); // Obtener el año
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes y agregar un cero delante si es necesario
    const day = String(date.getDate()).padStart(2, '0'); // Obtener el día y agregar un cero delante si es necesario

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const dateString = `${day}-${month}-${year} ${hours}:${minutes}`
    
    return dateString
}

export const formatearHoraMinutos = (date: Date = new Date()): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
}

  

export const renderFechaDataGrid = (fecha: any) => {
    if (!fecha || fecha == '') return null

    const formatoCortaExp = /^\d{4}-\d{1,2}-\d{1,2}$/

    const formatoCortaExp2 = /^\d{1,2}\/\d{1,2}\/\d{4}$/

    if (formatoCortaExp.test(fecha)) {
      const fechaSplit = fecha.split('-')

      return new Date(fechaSplit[0], fechaSplit[1] - 1, fechaSplit[2])
    }

    if (formatoCortaExp2.test(fecha)) {
      const fechaSplit = fecha.split('/')

      return new Date(fechaSplit[2], fechaSplit[1] - 1, fechaSplit[0])
    }

    return fecha
  }

//Entrega la fecha actual
export const obtenerFechaActual = () => {
    return format(new Date(), 'yyyy-MM-dd')
} 