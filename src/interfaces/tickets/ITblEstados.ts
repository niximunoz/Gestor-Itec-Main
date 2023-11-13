export interface ITblEstados {
    Id: number
    EstadoId : number
    EstadoNombre : string
    EstadoDescripcion: string
    FechaModificacion : Date | null
    FechaCreacion : Date
    Activo : boolean
}