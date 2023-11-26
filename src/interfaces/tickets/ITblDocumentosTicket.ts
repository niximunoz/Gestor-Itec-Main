export interface ITblDocumentosTicket {
    InfoDocumentoTicket : ITblDocumentosTicket
    InfoDocumento : ITblDocumentos
}

export interface ITblDocumentos {
    DocumentoId : number
    DocumentoNombreOriginal : string
    DocumentoNombreModificado : string
    RutaArchivoAlmacenado : string
    PesoArchivoAlmacenado : number
    IdUserCrea: number
    FechaCreacion : Date
    Activo : boolean
}

export interface ITblDocumentosTicket {
    IdDocumentoTicket : number
    TicketId : number
    IdDocumentoInformacion : number
    DocumentoNombre : string
    IdUserCrea : number
    FechaCreacion : Date
    Activo : boolean
}