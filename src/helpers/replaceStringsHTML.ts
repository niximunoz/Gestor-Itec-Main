import { renderFormartFecha, renderFormartFechaHora } from './tablaGrid'
import { formatearRut } from './formatearInput'

export const replaceCartas = (rawHtml: string, fromData: any, dataForm: any, type: string, cargo: any, fullName: any, firma: any) => {

    const hoy = new Date()

    const dia = hoy.toLocaleDateString('cl-CL', { weekday: 'short'});
    const diaNum = hoy.getDate()
    const mes = hoy.toLocaleDateString('cl-CL', {month: 'long'})
    const year = hoy.getFullYear()

    if(type == 'ICM'){
        let HTMLreplaced = rawHtml
        HTMLreplaced = HTMLreplaced.replace(/\$\$LOGO\$\$/,imgLogoIsalud)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_BENEFICIARIO\$\$/, (!fromData.Icm.NombreBeneficiario)?'':fromData.Icm.NombreBeneficiario)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_PACIENTE\$\$/, (!fromData.Icm.NombreBeneficiario)?'':fromData.Icm.NombreBeneficiario)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_MEDICO_DERIVADOR\$\$/, (!fromData.Icm.NombreMedicoDerivador)?'':fromData.Icm.NombreMedicoDerivador)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RAZON_SOCIAL\$\$/, (!fromData.Icm.NombreEmpresa)?'':fromData.Icm.NombreEmpresa)
        HTMLreplaced = HTMLreplaced.replace(/\$\$N_OCM\$\$/, (!fromData.Icm.NOcm)?'':fromData.Icm.NOcm)
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA_HOY\$\$/, `${dia}. ${diaNum} ${mes} ${year}`)
        HTMLreplaced = HTMLreplaced.replace(/\$\$AUTOR\$\$/, (!fullName)?'': fullName)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CARGO\$\$/, (!cargo?'': cargo))
        HTMLreplaced = HTMLreplaced.replace(/\$\$FIRMA_AUTOR\$\$/, (!firma)?'':firma)
        HTMLreplaced = HTMLreplaced.replace(/\$\$N_ICM\$\$/, (!fromData.Icm.NIcm)?'':fromData.Icm.NIcm)
        HTMLreplaced = HTMLreplaced.replace(/\$\$C_C\$\$/, (!fromData.Icm.CentroCosto)?'':fromData.Icm.CentroCosto)
        HTMLreplaced = HTMLreplaced.replace(/\$\$DOMICILIO_BENEFICIARIO\$\$/, (!fromData.Icm.DomicilioBeneficiario)?'':fromData.Icm.DomicilioBeneficiario)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CEL_BENEFICIARIO\$\$/, (!fromData.Icm.CelBeneficiario)?'':fromData.Icm.CelBeneficiario)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_BENEFICIARIO\$\$/, (!fromData.Icm.RutBeneficiario)?'':formatearRut(fromData.Icm.RutBeneficiario))
        HTMLreplaced = HTMLreplaced.replace(/\$\$CEL_ACOMPANANTE\$\$/, (!fromData.Icm.CelAcompañante)?'':fromData.Icm.CelAcompañante)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_ACOMPANANTE\$\$/, (!fromData.Icm.RutAcompañante)?'':formatearRut(fromData.Icm.RutAcompañante))
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_ACOMP\$\$/, (!fromData.Icm.NombreAcomp)?'':fromData.Icm.NombreAcomp)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_ACOMPANANTE\$\$/, (!fromData.Icm.NombreAcomp)?'':fromData.Icm.NombreAcomp)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_AFILIADO\$\$/, (!fromData.Icm.RutAfiliado)?'':formatearRut(fromData.Icm.RutAfiliado))
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_MEDICO_DER\$\$/, (!fromData.Icm.RutMedicoDer)?'':formatearRut(fromData.Icm.RutMedicoDer))
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_MEDICO_DERIVADOR\$\$/, (!fromData.Icm.RutMedicoDer)?'':fromData.Icm.RutMedicoDer)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RAZON_SOCIAL_PRESTADOR\$\$/, (!fromData.Icm.RazonSocialPrestador)?'':fromData.Icm.RazonSocialPrestador)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CIUDAD_ORIGEN\$\$/, (!fromData.Icm.CiudadOrigen)?'':fromData.Icm.CiudadOrigen)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CIUDAD_DESTINO\$\$/, (!fromData.Icm.CiudadDestino)?'':fromData.Icm.CiudadDestino)
        
        HTMLreplaced = HTMLreplaced.replace(/\$\$N_ICM\$\$/, (!fromData.Icm.NIcm)?'':fromData.Icm.NIcm)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_AFILIADO\$\$/, ( (fromData.Icm.NombreAfi ?? '')+ ' ' + (fromData.Icm.ApellidoAfi ?? '')) )
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_USU\$\$ \$\$APELLIDO_USU/, (!fromData.Icm.NombreEnfermera)?'':fromData.Icm.NombreEnfermera)
        HTMLreplaced = HTMLreplaced.replace(/\$\$Fecha_Inicio\$\$/, 'POR DEFINIR')

        return HTMLreplaced

    }else{

        let HTMLreplaced = rawHtml
        HTMLreplaced = HTMLreplaced.replace(/\$\$LOGO\$\$/,imgLogoIsalud)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_BENEFICIARIO\$\$/, (!fromData.Log.Beneficiario)?'':fromData.Log.Beneficiario)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_MEDICO_DERIVADOR\$\$/, (!fromData.Log.MedicoDerivador)?'':fromData.Log.MedicoDerivador)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RAZON_SOCIAL\$\$/, (!fromData.Log.RazonSocial)?'':fromData.Log.RazonSocial)
        HTMLreplaced = HTMLreplaced.replace(/\$\$PROVEEDOR\$\$/, (!fromData.Log.RazonSocial)?'':fromData.Log.RazonSocial)
        HTMLreplaced = HTMLreplaced.replace(/\$\$N_OCM\$\$/, (!fromData.Log.NumOcm)?'':fromData.Log.NumOcm)
        HTMLreplaced = HTMLreplaced.replace(/\$\$N_ICM\$\$/, (!fromData.Log.NumIcm)?'':fromData.Log.NumIcm)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CIUDAD_ORIGEN\$\$/, (!fromData.Log.CiudadOrigen)?'':fromData.Log.CiudadOrigen)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CIUDAD_DESTINO\$\$/, (!fromData.Log.CiudadDestino)?'':fromData.Log.CiudadDestino)
        HTMLreplaced = HTMLreplaced.replace(/\$\$N_SAP\$\$/, (!fromData.Log.NumSap)?'':fromData.Log.NumSap)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_ENFERMERA\$\$/, (!fromData.Log.NombreEnfermera)?'':fromData.Log.NombreEnfermera)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_BENEFICIARIO\$\$/, (!fromData.Log.RutBeneficiario)?'':formatearRut(fromData.Log.RutBeneficiario))
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA\$\$/, (!fromData.Log.Fecha)?'':renderFormartFecha(fromData.Log.Fecha))
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA_RESERVA\$\$/, (!fromData.Log.Fecha)?'':renderFormartFecha(fromData.Log.Fecha))
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA_FIN\$\$/, (!fromData.Log.FechaLlegada)?'':renderFormartFecha(fromData.Log.FechaLlegada))
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA_PRESENTACION\$\$/, (!fromData.Log.FechaPresentacion)?'':renderFormartFechaHora(fromData.Log.FechaPresentacion))
        HTMLreplaced = HTMLreplaced.replace(/\$\$HORA_VUELO\$\$/, (!fromData.Log.HoraVuelo)?'':fromData.Log.HoraVuelo)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NUM_VUELO\$\$/, (!fromData.Log.NumVuelo)?'':fromData.Log.NumVuelo)
        HTMLreplaced = HTMLreplaced.replace(/\$\$OBSERVACIONES\$\$/, (!fromData.Log.Observaciones)?'':fromData.Log.Observaciones)
        HTMLreplaced = HTMLreplaced.replace(/\$\$DESTINATARIO\$\$/, (!dataForm.NombreDestinatario)?'':dataForm.NombreDestinatario)
        HTMLreplaced = HTMLreplaced.replace(/\$\$AUTOR\$\$/, (!fullName)?'': fullName)
        HTMLreplaced = HTMLreplaced.replace(/\$\$CARGO\$\$/, (!cargo?'': cargo))
        HTMLreplaced = HTMLreplaced.replace(/\$\$ENCABEZADO\$\$/, (!fromData.Log.Observaciones)?'':fromData.Log.Observaciones)
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA_HOY\$\$/, `${dia}. ${diaNum} ${mes} ${year}`)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_AFILIADO\$\$/, (!fromData.Log.RutAfiliado)?'':formatearRut(fromData.Log.RutAfiliado))
        HTMLreplaced = HTMLreplaced.replace(/\$\$RAZON_SOCIAL_PRESTADOR\$\$/, (!fromData.Log.RazonSocialPrestador)?'':fromData.Log.RazonSocialPrestador)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_MEDICO_DERIVADOR\$\$/, (!fromData.Log.RutMedicoDerivador)?'':formatearRut(fromData.Log.RutMedicoDerivador))
        HTMLreplaced = HTMLreplaced.replace(/\$\$C_C\$\$/, (!fromData.Log.CentroCosto)?'':fromData.Log.CentroCosto)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_ALOJADO\$\$/, (!fromData.Log.NombreAlojado)?'':fromData.Log.NombreAlojado)
        HTMLreplaced = HTMLreplaced.replace(/\$\$TIPO_HAB\$\$/, (!fromData.Log.TipoHabitacion)?'':fromData.Log.TipoHabitacion)
        HTMLreplaced = HTMLreplaced.replace(/\$\$FIN_RESERVA\$\$/, (!fromData.Log.FechaLlegada)?'':fromData.Log.FechaLlegada)
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_ACOMPANANTE\$\$/, (!fromData.Log.NombreAcompanante)?'':fromData.Log.NombreAcompanante)
        HTMLreplaced = HTMLreplaced.replace(/\$\$RUT_ACOMPANANTE\$\$/, (!fromData.Log.RutAcompanante)?'':formatearRut(fromData.Log.RutAcompanante))
        HTMLreplaced = HTMLreplaced.replace(/\$\$HORA_RESERVA\$\$/, (!fromData.Log.Fecha)?'':fromData.Log.Fecha.split('T')[1])
        HTMLreplaced = HTMLreplaced.replace(/\$\$FIRMA_ENFERMERA\$\$/, 'FIRMA ENFERMERA - POR DEFINIR')
        HTMLreplaced = HTMLreplaced.replace(/\$\$FIRMA_AUTOR\$\$/, (!firma)?'':firma)
        HTMLreplaced = HTMLreplaced.replace(/\$\$TELEFONOS\$\$/, (!fromData.Log.Telefonos)?'':fromData.Log.Telefonos)
        HTMLreplaced = HTMLreplaced.replace(/\$\$TELEFONO_BENEF\$\$/, (!fromData.Log.TelefonoBenef)?'':fromData.Log.TelefonoBenef)
        HTMLreplaced = HTMLreplaced.replace(/\$\$FECHA_ARRIBO\$\$/,(!fromData.Log.FechaLlegada)?'':renderFormartFecha(fromData.Log.FechaLlegada))
        HTMLreplaced = HTMLreplaced.replace(/\$\$HORA_ARRIBO\$\$/, (!fromData.Log.FechaLlegada)?'':fromData.Log.FechaLlegada.split('T')[1])
        HTMLreplaced = HTMLreplaced.replace(/\$\$ORIGEN\$\$/, (!fromData.Log.Origen)?'':fromData.Log.Origen)
        HTMLreplaced = HTMLreplaced.replace(/\$\$DESTINO\$\$/, (!fromData.Log.Destino)?'':fromData.Log.Destino)

        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_AFILIADO\$\$/, ( (fromData.Log.NombreAfi ?? '')+ ' ' + (fromData.Log.ApellidoAfi ?? '')) )
        HTMLreplaced = HTMLreplaced.replace(/\$\$NOMBRE_USU\$\$ \$\$APELLIDO_USU/, (!fromData.Log.NombreEnfermera)?'':fromData.Log.NombreEnfermera)
        HTMLreplaced = HTMLreplaced.replace(/\$\$Fecha_Inicio\$\$/, 'POR DEFINIR')

        return HTMLreplaced

    }
}



export const imgLogoIsalud = 
'<img src="/images/favicon-itec.png" alt="LOGO ITEC" style="max-width:150px">'