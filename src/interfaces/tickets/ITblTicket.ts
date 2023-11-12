export interface ITblTicket {
    TickId : number
    UserCreaId : number
    CategoriaId : number
    TickTitulo : string
    TickDescripcion : string
    EstadoId : number
    UserAsignadoRut : number | null
    FechaAsignacion : Date | null
    FechaCreacion : Date
    Activo : boolean
}