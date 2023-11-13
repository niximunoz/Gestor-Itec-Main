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
import { ITblCategorias } from 'src/interfaces'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaCategoria = yup.object({
  CatId: stringRequired,
  CatNombre: stringRequired,
  Activo: booleanRequired
})

type Props = {
  recargar: () => Promise<void>
}

const CtrlModalEditarCategoria = ({ recargar }: Props) => {
  const [loading, setLoading] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ITblCategorias | null>(null)

  const abrirModal = async (data : ITblCategorias) => {
    setAbrir(true)
    setCategoriaSeleccionada(data)
  }

  const cerrarModal = (reset: UseFormReset<IFormInputs>) => {
    reset()
    setAbrir(false)
  }


  const crearCategoria = async (data: IFormInputs, reset: UseFormReset<IFormInputs>) => {
    setLoading(true)
    try {
      if(categoriaSeleccionada != null){
        const newCategoria = {
          Id: categoriaSeleccionada.Id,
          CatId: parseInt(data.CatId),
          CatNombre: data.CatNombre,
          FechaCreacion: categoriaSeleccionada.FechaCreacion,
          Activo: data.Activo
        }
  
        const {data : infoCategoria} = await instanceMiddlewareApi.post('/Parametros/UpdateCategoria/', newCategoria)
  
        if (infoCategoria.Data && infoCategoria.Information.StatusCode == 200) {
          await Swal.fire({
            icon: 'success',
            title: 'Categoria Actualizada',
            text: 'Se Actualizo correctamente la Categoria.',
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
    schemaCategoria,
    loading,
    abrir,
    abrirModal,
    cerrarModal,
    crearCategoria
  }
}

export default CtrlModalEditarCategoria
