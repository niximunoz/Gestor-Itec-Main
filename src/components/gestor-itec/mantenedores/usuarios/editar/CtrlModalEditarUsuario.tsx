import { Fade, FadeProps } from '@mui/material'
import React, { forwardRef, ReactElement, Ref, SyntheticEvent, useState } from 'react'
import * as yup from 'yup'
import { instanceMiddlewareApi } from 'src/axios'

import {
  booleanRequired,
  emailRequired,
  stringRequired
} from 'src/helpers'
import Swal from 'sweetalert2'
import { IFormInputs } from './interface'
import { UseFormReset, UseFormSetValue } from 'react-hook-form'
import { ITblRolesUsuario, ITblUsuario } from 'src/interfaces'

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
  UsuEmail: emailRequired,
  UsuRol: stringRequired,
  Activo: booleanRequired
})

type Props = {
  recargar: () => Promise<void>
}

const CtrlModalEditarUsuario = ({ recargar }: Props) => {
  const [loading, setLoading] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)
  const [listadoRoles, setListadoRoles] = useState<ITblRolesUsuario[]>([])
  const [rolSeleccionado, setRolSeleccionado] = useState<ITblRolesUsuario | null>(null)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<ITblUsuario | null>(null)

  const abrirModal = async (data : ITblUsuario) => {
    setAbrir(true)
    if(data != null){
      console.log(data)
      await cargarDatos(data)
    }
  }

  const cerrarModal = (reset: UseFormReset<IFormInputs>) => {
    reset()
    setAbrir(false)
  }

  const cargarDatos = async (data : ITblUsuario) => {
    try{
        setLoading(true)
        const {data : infoUsuario} = await instanceMiddlewareApi.get('/Usuarios/ObtenerRolUsuarios')
        setListadoRoles(infoUsuario.Data ?? [])
        if(data && data.UsuId > 0){
          setUsuarioSeleccionado(data)
          setRolSeleccionado(infoUsuario.Data.find((x : ITblRolesUsuario) => x.RolNombre == data.UsuRol))
        }
    }catch(error){
        console.error(error)
    }finally{
        setLoading(false)
    }
  }

  const actualizarUsuario = async (data: IFormInputs, reset: UseFormReset<IFormInputs>) => {
    setLoading(true)
    try {
      const newUsuario = {
        UsuId: usuarioSeleccionado?.UsuId,
        UsuRut: parseInt(data.UsuRut),
        UsuDvRut: data.UsuDvRut,
        UsuNombre: data.UsuNombre,
        UsuApellido: data.UsuApellido,
        UsuEmail: data.UsuEmail,
        UsuRol: data.UsuRol,
        FechaCreacion: usuarioSeleccionado?.FechaCreacion,
        Activo: data.Activo
      }

      const {data : infoUsuario} = await instanceMiddlewareApi.post('/Usuarios/ActualizarUsuario/', newUsuario)

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
    actualizarUsuario,
    handleChangeRol
  }
}

export default CtrlModalEditarUsuario
