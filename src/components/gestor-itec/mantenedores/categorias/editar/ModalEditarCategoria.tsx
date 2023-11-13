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
import CtrlModalEditarCategoria from './CtrlModalEditarCategoria'
import { ITblCategorias } from 'src/interfaces'

type Props = {
  recargar: () => Promise<void>
  data: ITblCategorias
}
export const ModalEditarCategoria = ({ recargar,data}: Props) => {
  const {
    Transition,
    schemaCategoria,
    loading,
    abrir,
    abrirModal,
    cerrarModal,
    crearCategoria
  } = CtrlModalEditarCategoria({
    recargar
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaCategoria)
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
        <form onSubmit={handleSubmit((data : IFormInputs) => crearCategoria(data, reset))}>
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
                    name='CatId'
                    control={control}
                    defaultValue={data.CatId.toString() ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Codigo Categoria'
                        value={value}
                        onChange={e => {
                            const newValue = e.target.value.replace(/[^0-9]/g, '')
                            onChange(newValue)
                            setValue('CatId', newValue)
                          }}
                        error={Boolean(errors.CatId)}
                        placeholder='Codigo Categoria'
                        inputProps={{
                          maxLength: 8
                        }}
                      />
                    )}
                  />
                  {errors.CatId && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.CatId.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='CatNombre'
                    control={control}
                    defaultValue={data.CatNombre ?? ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Nombre Categoria'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.CatNombre)}
                        placeholder='Nombre Categoria'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.CatNombre && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.CatNombre.message}
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
