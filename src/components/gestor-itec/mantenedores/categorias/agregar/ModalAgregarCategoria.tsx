import { Add, Close, Save } from '@mui/icons-material'
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
} from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import UserSpinner from 'src/layouts/components/UserSpinner'
import { IFormInputs } from './interface'
import CtrlModalAgregarCategoria from './CtrlModalAgregarCategoria'

type Props = {
  recargar: () => Promise<void>
}
export const ModalAgregarCategoria = ({ recargar}: Props) => {
  const {
    Transition,
    schemaCategoria,
    loading,
    abrir,
    abrirModal,
    cerrarModal,
    crearCategoria
  } = CtrlModalAgregarCategoria({
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
      <Tooltip title={'Agregar Categoria'} arrow>
        <Button
          sx={{ mr: 2, mb: 2 }}
          variant='outlined'
          color='info'
          startIcon={<Add />}
          onClick={() => abrirModal()}
          className='classBtnAgregarCategoria'
        >
          Agregar Categoria
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

            <Tooltip title={'Nueva Categoria'} arrow>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Nueva Categoria
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
                    defaultValue=''
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
                    defaultValue={''}
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
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Tooltip title={'Guardar'} arrow>
              <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
                <Save sx={{ mr: 1 }} /> Guardar
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
