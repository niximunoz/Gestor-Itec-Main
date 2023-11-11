export interface ITblTicket {
    TickId : number
    UserCreaId : number
    CategoriaId : number
    TickTitulo : string
    TickDescripcion : string
    EstadoId : number
    UserAsignadoId : number | null
    FechaAsignacion : Date | null
    FechaCreacion : Date
    Activo : boolean
}