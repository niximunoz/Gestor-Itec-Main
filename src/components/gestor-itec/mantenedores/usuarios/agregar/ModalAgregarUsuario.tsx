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
  Autocomplete,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import UserSpinner from 'src/layouts/components/UserSpinner'
import { IFormInputs } from './interface'
import CtrlModalAgregarUsuario from './CtrlModalAgregarUsuario'
import { calculateRutVerificador } from 'src/helpers'

type Props = {
  recargar: () => Promise<void>
}
export const ModalAgregarUsuario = ({ recargar}: Props) => {
  const {
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
  } = CtrlModalAgregarUsuario({
    recargar
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaUsuario)
  })

  return (
    <>
      <Tooltip title={'Agregar Usuario'} arrow>
        <Button
          sx={{ mr: 2, mb: 2 }}
          variant='outlined'
          color='info'
          startIcon={<Add />}
          onClick={() => abrirModal()}
          className='classBtnAgregarUsuario'
        >
          Agregar Usuario
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
        <form onSubmit={handleSubmit((data : IFormInputs) => crearUsuario(data, reset))}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={() => cerrarModal(reset)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Close />
            </IconButton>

            <Tooltip title={'Nuevo Usuario'} arrow>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Nuevo Usuario
                </Typography>
              </Box>
            </Tooltip>

            {loading ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='UsuRut'
                    control={control}
                    defaultValue=''
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Rut Usuario'
                        value={value}
                        onChange={e => {
                            const newValue = e.target.value.replace(/[^0-9]/g, '')
                            onChange(newValue)
                            setValue('UsuRut', newValue)
                            if (newValue.length > 6) {
                              const dv = calculateRutVerificador(newValue)
                              setValue('UsuDvRut', dv.toLocaleUpperCase())
                            } else {
                              setValue('UsuDvRut', '')
                            }
                          }}
                        error={Boolean(errors.UsuRut)}
                        placeholder='Rut Usuario'
                        inputProps={{
                          maxLength: 8
                        }}
                      />
                    )}
                  />
                  {errors.UsuRut && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuRut.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Controller
                    name='UsuDvRut'
                    control={control}
                    defaultValue=''
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Dígito Verificador'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuDvRut)}
                        placeholder='Dígito Verificador'
                        inputProps={{
                            readOnly: true
                        }}
                      />
                    )}
                  />
                  {errors.UsuDvRut && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuDvRut.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='UsuNombre'
                    control={control}
                    defaultValue={''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Nombre Usuario'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuNombre)}
                        placeholder='Nombre Usuario'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.UsuNombre && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.UsuNombre.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='UsuApellido'
                    control={control}
                    defaultValue={''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Apellido Usuario'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuApellido)}
                        placeholder='Apellido Usuario'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.UsuApellido && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.UsuApellido.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='UsuEmail'
                    control={control}
                    defaultValue={''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Correo Electronico'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.UsuEmail)}
                        placeholder='Usuario@itec.cl'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errors.UsuEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuEmail.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                      name='UsuRol'
                      control={control}
                      defaultValue={null}
                      render={() => (
                        <Autocomplete
                          filterSelectedOptions
                          value={rolSeleccionado}
                          options={listadoRoles ?? []}
                          onChange={(_e, v) => {
                            handleChangeRol(_e, v, setValue)
                          }}
                          id='autocomplete-controlled'
                          getOptionLabel={option => option.RolNombre ?? ''}
                          renderInput={params => (
                            <TextField {...params} error={Boolean(errors.UsuRol)} label='Selecciona un Rol' />
                          )}
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option.RolId}>
                               { `${option.RolNombre}  (${option.RolDescripcion})`}
                              </li>
                            )
                          }}
                        />
                      )}
                    />
                    {errors.UsuRol && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.UsuRol.message}</FormHelperText>
                    )}
                  </Grid>


                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Activo'
                    control={control}
                    defaultValue={false}
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
