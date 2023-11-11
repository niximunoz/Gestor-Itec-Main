

export const calculate_age = (date:string) => {
    
    const dia  = date.substring(0, 2)
    const mes  = date.substring(3, 5)
    const anno = date.substring(6, 10)

    const dob = new Date(~~anno, ~~mes, ~~dia)

    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export const formatDate = (value:string) => {
    const dia = value.substring(8, 10);
    const mes = value.substring(5, 7);
    const anno = value.substring(0, 4);

    return `${dia}-${mes}-${anno}`;
};