export const formatearRut = (rut: string ) => {
    if( rut?.length > 0){
    const valor = rut.replace(/\./g,'').replace('-','');
    const cuerpo = valor.slice(0,-1);
    const dv = valor.slice(-1).toUpperCase();
    rut = cuerpo + '-'+ dv

    return rut;
    }

    return ''
}

export const validarRutRegexp = (rut: string) => {
    const regexp = /^\d{1,2}\d{3}\d{3}[-][0-9kK]{1}$/g
    
    return regexp.test(rut)  ? true : false
}


export const formatearMiles = (num: any) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}