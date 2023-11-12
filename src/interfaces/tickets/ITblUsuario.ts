export interface ITblUsuario {
    UsuId : number
    UsuRut : number
    UsuDvRut : string
    UsuNombre : string
    UsuApellido : string
    UsuEmail : string
    UsuPassword : string
    UsuRol : string | null
    FechaModificacion : Date | null
    FechaCreacion : Date
    Activo : boolean
}