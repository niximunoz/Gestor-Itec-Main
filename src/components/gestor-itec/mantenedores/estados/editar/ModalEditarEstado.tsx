import { Add, Close, Edit, Save } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  FormControlLabel,
  Switch,
} from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import UserSpinner from 'src/layouts/components/UserSpinner'
import { IFormInputs } from './interface'
import CtrlModalEditarEstado from './CtrlModalEditarEstado'
import { ITblEstados } from 'src/interfaces'

type Props = {
  recargar: () => Promise<void>
  data: ITblEstados
}
export const ModalEditarEstado = ({ recargar,data}: Props) => {
  const {
    Transition,
    schemaEstado,
    loading,
    abrir,
    abrirModal,
    cerrarModal,
    actualizarEstado
  } = CtrlModalEditarEstado({
    recargar
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaEstado)
  })

  return (
    <>
      <Tooltip title={'Editar Categoria'} arrow>
        <Button variant='text' color='warning' onClick={() => abrirModal(data)}>
          <Edit />
        </Button>
      </Tooltip>

      <Dialog
        fullWidth
        open={abrir}
        maxWidth='md'
        scroll='body'
        onClose={() => cerrarModal(reset)}
        TransitionComponent={Transition}
        onBackdropClick={() => cerrarModal(reset)}
      >
        <form onSubmit={handleSubmit((data : IFormInputs) => actualizarEstado(data, reset))}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={() => cerrarModal(reset)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Close />
            </IconButton>

            <Tooltip title={'Editar Categoria'} arrow>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Editar Categoria
                </Typography>
              </Box>
            </Tooltip>

            {loading ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='EstadoId'
                    control={control}
                    defaultValue={data.EstadoId.toString() ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Codigo Estado'
                        value={value}
                        onChange={e => {
                            const newValue = e.target.value.replace(/[^0-9]/g, '')
                            onChange(newValue)
                            setValue('EstadoId', newValue)
                          }}
                        error={Boolean(errors.EstadoId)}
                        placeholder='Codigo Estado'
                        inputProps={{
                          maxLength: 8
                        }}
                      />
                    )}
                  />
                  {errors.EstadoId && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.EstadoId.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='EstadoNombre'
                    control={control}
                    defaultValue={data.EstadoNombre ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Nombre Estado'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.EstadoNombre)}
                        placeholder='Nombre Estado'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.EstadoNombre && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.EstadoNombre.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='EstadoDescripcion'
                    control={control}
                    defaultValue={data.EstadoDescripcion ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Descripción Estado'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.EstadoDescripcion)}
                        placeholder='Descripción Estado'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.EstadoDescripcion && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.EstadoDescripcion.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Activo'
                    control={control}
                    defaultValue={data.Activo}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={<Switch checked={value} onChange={onChange} />}
                        label='Activo'
                        sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}
                        id='activo'
                      />
                    )}
                  />
                  {errors.Activo && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.Activo.message}</FormHelperText>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Tooltip title={'Actualizar'} arrow>
              <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
                <Save sx={{ mr: 1 }} /> Actualizar
              </Button>
            </Tooltip>
            <Tooltip title={'Cancelar'} arrow>
              <Button variant='outlined' color='secondary' onClick={() => cerrarModal(reset)}>
                Cancelar
              </Button>
            </Tooltip>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
