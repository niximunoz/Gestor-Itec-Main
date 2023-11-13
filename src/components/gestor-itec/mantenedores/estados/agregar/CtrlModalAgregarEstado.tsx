import { Fade, FadeProps } from '@mui/material'
import React, { forwardRef, ReactElement, Ref, useState } from 'react'
import * as yup from 'yup'
import { instanceMiddlewareApi } from 'src/axios'

import {
  booleanRequired,
  stringRequired
} from 'src/helpers'
import Swal from 'sweetalert2'
import { IFormInputs } from './interface'
import { UseFormReset } from 'react-hook-form'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaEstado = yup.object({
  EstadoId: stringRequired,
  EstadoNombre: stringRequired,
  EstadoDescripcion: stringRequired,
  Activo: booleanRequired
})

type Props = {
  recargar: () => Promise<void>
}

const CtrlModalAgregarEstado = ({ recargar }: Props) => {
  const [loading, setLoading] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)

  const abrirModal = async () => {
        setAbrir(true)
  }

  const cerrarModal = (reset: UseFormReset<IFormInputs>) => {
    reset()
    setAbrir(false)
  }


  const crearCategoria = async (data: IFormInputs, reset: UseFormReset<IFormInputs>) => {
    setLoading(true)
    try {
      const newEstado = {
        EstadoId: parseInt(data.EstadoId),
        EstadoNombre: data.EstadoNombre,
        EstadoDescripcion: data.EstadoDescripcion
      }

      const {data : infoCategoria} = await instanceMiddlewareApi.post('/Parametros/SaveEstado/', newEstado)

      if (infoCategoria.Data && infoCategoria.Information.StatusCode == 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Estado Creado',
          text: 'Se creo correctamente el Estado.',
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

  return {
    Transition,
    schemaEstado,
    loading,
    abrir,
    abrirModal,
    cerrarModal,
    crearCategoria
  }
}

export default CtrlModalAgregarEstado
