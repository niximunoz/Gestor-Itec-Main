import { Fade, FadeProps } from '@mui/material'
import React, { forwardRef, ReactElement, Ref, SyntheticEvent, useState } from 'react'
import * as yup from 'yup'
import { instanceMiddlewareApi } from 'src/axios'

import {
  booleanRequired,
  emailNotRequired,
  stringRequired
} from 'src/helpers'
import Swal from 'sweetalert2'
import { IFormInputs } from './interface'
import { UseFormReset, UseFormSetValue } from 'react-hook-form'
import { ITblRolesUsuario } from 'src/interfaces'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaUsuario = yup.object({
  UsuRut: stringRequired,
  UsuDvRut: stringRequired,
  UsuNombre: stringRequired,
  UsuApellido: stringRequired,
  UsuEmail: emailNotRequired,
  UsuRol: stringRequired,
  Activo: booleanRequired
})

type Props = {
  recargar: () => Promise<void>
}

const CtrlModalAgregarUsuario = ({ recargar }: Props) => {
  const [loading, setLoading] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)
  const [listadoRoles, setListadoRoles] = useState<ITblRolesUsuario[]>([])
  const [rolSeleccionado, setRolSeleccionado] = useState<ITblRolesUsuario | null>(null)

  const abrirModal = async () => {
    await cargarDatos().then(() => {
        setAbrir(true)
    })
  }

  const cerrarModal = (reset: UseFormReset<IFormInputs>) => {
    reset()
    setAbrir(false)
  }

  const cargarDatos = async () => {
    try{
        setLoading(true)
        const {data : infoUsuario} = await instanceMiddlewareApi.get('/Usuarios/ObtenerRolUsuarios')
        setListadoRoles(infoUsuario.Data ?? [])

    }catch(error){
        console.error(error)
    }finally{
        setLoading(false)
    }
  }

  const crearUsuario = async (data: IFormInputs, reset: UseFormReset<IFormInputs>) => {
    setLoading(true)
    try {
      const newUsuario = {
        UsuRut: parseInt(data.UsuRut),
        UsuDvRut: data.UsuDvRut,
        UsuNombre: data.UsuNombre,
        UsuApellido: data.UsuApellido,
        UsuEmail: data.UsuEmail,
        UsuRol: data.UsuRol,
        FechaCreacion: new Date(),
        Activo: data.Activo
      }

      const {data : infoUsuario} = await instanceMiddlewareApi.post('/Usuarios/AgregarUsuario/', newUsuario)

      if (infoUsuario.Data && infoUsuario.Information.StatusCode == 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Usuario Creado',
          text: 'Se creo correctamente el Usuario.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#00b8cc'
        }).then((result: any) => {
          if(result.isConfirmed){
            recargar()
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups.. Ocurrio un error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#00b8cc'
        })
      }
    } catch (error) {
      console.error('Descripción error', error)
    } finally {
      cerrarModal(reset)
      setLoading(false)
    }
  }

  const handleChangeRol = (
    event: SyntheticEvent,
    newValue: ITblRolesUsuario | null,
    setValue: UseFormSetValue<IFormInputs>) => {
        setValue('UsuRol', newValue?.RolNombre ?? '')
        setRolSeleccionado(newValue ?? null)
  }

  return {
    Transition,
    schemaUsuario,
    loading,
    abrir,
    listadoRoles,
    rolSeleccionado,
    abrirModal,
    cerrarModal,
    crearUsuario,
    handleChangeRol
  }
}

export default CtrlModalAgregarUsuario
