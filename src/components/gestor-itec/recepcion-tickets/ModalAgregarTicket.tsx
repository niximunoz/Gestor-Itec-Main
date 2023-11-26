import { Add, Close, Save } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  FadeProps,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
  styled,
  TypographyProps,
  ListItem,
  List
} from '@mui/material'
import React, { forwardRef, ReactElement, Ref, useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import UserSpinner from 'src/layouts/components/UserSpinner'
import Swal from 'sweetalert2'
import { instanceMiddlewareApi } from 'src/axios'
import { ITblCategorias, ITblEstados, ITblUsuario } from 'src/interfaces'
import { useDropzone } from 'react-dropzone'

export interface FileProp {
  name: string
  type: string
  size: number
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schemaTicket = yup.object({
  Titulo: yup.string().required('Campo Requerido'),
  Categoria: yup.string().required('Campo Requerido'),
  Descripción: yup.string().required('Campo Requerido').typeError('Campo Requerido')
})

interface IFormInputs {
  Titulo: string
  Categoria: string
  Descripción: string
  RutUsuarioAsignado: number | null
  IdEstado: number | null
}

type Props = {
  listaDatosUsuarios: ITblUsuario[]
  listaDatosCategorias: ITblCategorias[]
  listaDatosEstados: ITblEstados[]
  recargar: () => Promise<void>
}

export const ModalAgregarTicket = ({
  listaDatosUsuarios,
  listaDatosCategorias,
  recargar
}: Props) => {
  const {
    handleSubmit,
    control: controlTicket,
    formState: { errors: errorsTicket },
    setValue: setValueTicket,
    reset: resetTicket
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaTicket)
  })

  const [cargando, setCargando] = useState(false)
  const [abrir, setAbrir] = useState<boolean>(false)
  const [categoriaTicket, setCategoriaTicket] = useState<ITblCategorias | null>(null)
  const [userAsignadoTicket, setUserAsignadoTicket] = useState<ITblUsuario | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const { usuRol: rolUsuario } = JSON.parse(localStorage.getItem('userData')!)

  const abrirModal = () => {
    setAbrir(true)
  }

  const cerrarModal = () => {
    resetTicket()
    setAbrir(false)
    setCargando(false)
    setCategoriaTicket(null)
    setUserAsignadoTicket(null)
  }

  const getBase64 = (file: any) => {
    return new Promise(resolve => {
      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = () => {
        const baseURL = reader.result as string
        const base64Data = baseURL.split(',')[1]

        resolve(base64Data)
      }
    })
  }

  const guardarDatos = async (data: IFormInputs) => {
    try {
      setCargando(true)
      if (data != null) {
        const { id: idUser } = JSON.parse(window.localStorage.getItem('userData')!)

        const newTicket = {
          UserCreaId: idUser,
          CategoriaId: categoriaTicket?.CatId,
          TickTitulo: data.Titulo,
          TickDescripcion: data.Descripción,
          EstadoId: userAsignadoTicket?.UsuRut != null ? 2 : 1,
          FechaCreacion: new Date(),
          UserAsignadoRut: userAsignadoTicket?.UsuRut ?? null,
          FechaAsignacion: userAsignadoTicket != null ? new Date() : null,
          Activo: true
        }
        console.log(files)
        const listadoDocumentosAdjuntoPromises = files.map(file => getBase64(file).then(base64Data => {
          return {
            NombreArchivo: file.name,
            Base64Archivo: base64Data
          }
        }))
        const listadoDocumentosAdjunto = await Promise.all(listadoDocumentosAdjuntoPromises)
        console.log(listadoDocumentosAdjunto)
        const cuerpoEnvio = {
          InfoTicket: newTicket,
          DocumentosAdjuntos : listadoDocumentosAdjunto
        }

        const { data: dataTicket } = await instanceMiddlewareApi.post(`/Parametros/SaveTicket`, cuerpoEnvio)

        if (dataTicket.Data != null) {
          await Swal.fire({
            title: 'Éxito',
            text: 'El Ticket se ingresó exitosamente.',
            icon: 'success',
            confirmButtonColor: '#0098aa',
            confirmButtonText: 'Aceptar'
          }).then((result: any) => {
            if (result.isConfirmed) {
              cerrarModal()
              recargar()
            }
          })
        }
      } else {
        Swal.fire({
          title: 'Ocurrio un error',
          text: 'No se pudo crear el Ticket.',
          icon: 'error',
          confirmButtonColor: '#0098aa',
          confirmButtonText: 'Aceptar'
        })
      }
    } catch (error) {
      console.log(error)
      setCargando(false)

      return
    } finally {
      setCargando(false)
    }
  }

  const renderFilePreview = (file: FileProp) => {
    const array = file.name.split('.')
    const ext = array[array.length - 1]
    if (ext === 'pdf') {
      return <img width={38} height={38} src='/icons/file-icons/pdf.png' />
    } else if (ext === 'xlsx') {
      return <img width={38} height={38} src='/icons/file-icons/xls.png' />
    }

    return <img width={38} height={38} src='/icons/file-icons/doc.png' />
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => removeFile(file.name)}>
        <Close />
      </IconButton>
    </ListItem>
  ))

  const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      width: 250
    }
  }))

  const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4)
    }
  }))

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName))
  }

  const handleChangeCategoriaTicket = (data: any) => {
    setCategoriaTicket(data)
    setValueTicket('Categoria', data.CatId)
  }

  const handleChangeUserCreaTicket = (data: any) => {
    setUserAsignadoTicket(data)
    setValueTicket('RutUsuarioAsignado', data.UsuRut)
  }

  const onErrors: any = (errors: any, e: any) => console.log(errors, e)

  return (
    <>
      <Button
        sx={{ mr: 2, mb: 2 }}
        variant='outlined'
        color='info'
        startIcon={<Add />}
        onClick={() => abrirModal()}
        className='classBtnAgregarTicket'
      >
        Ingresar Ticket
      </Button>

      <Dialog
        fullWidth
        open={abrir}
        maxWidth='md'
        scroll='body'
        onClose={cerrarModal}
        TransitionComponent={Transition}
        onBackdropClick={cerrarModal}
      >
        <form onSubmit={handleSubmit(guardarDatos, onErrors)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton size='small' onClick={cerrarModal} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Close />
            </IconButton>

            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Ingresar Ticket
              </Typography>
            </Box>

            {cargando ? (
              <UserSpinner />
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Titulo'
                    control={controlTicket}
                    defaultValue={''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Título del Ticket'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errorsTicket.Titulo)}
                        placeholder='Título del Ticket'
                        id='filled-multiline-flexible'
                        multiline
                      />
                    )}
                  />
                  {errorsTicket.Titulo && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Titulo.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Categoria'
                    control={controlTicket}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        filterSelectedOptions
                        value={categoriaTicket}
                        id='tags-standard'
                        options={listaDatosCategorias}
                        getOptionLabel={option => option.CatNombre ?? ''}
                        onChange={(e, data) => {
                          onChange(data)
                          handleChangeCategoriaTicket(data)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errorsTicket.Categoria)}
                            fullWidth
                            label='Seleccionar Categoría...'
                            variant='outlined'
                          />
                        )}
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.CatId}>
                              {option.CatNombre}
                            </li>
                          )
                        }}
                      />
                    )}
                  />
                  {errorsTicket.Categoria && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Categoria.message}</FormHelperText>
                  )}
                </Grid>
                {rolUsuario == 'admin' && (
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='RutUsuarioAsignado'
                      control={controlTicket}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterSelectedOptions
                          value={userAsignadoTicket}
                          id='tags-standard'
                          options={listaDatosUsuarios}
                          getOptionLabel={option => `${option.UsuNombre} ${option.UsuApellido}` ?? ''}
                          onChange={(e, data) => {
                            onChange(data)
                            handleChangeUserCreaTicket(data)
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errorsTicket.RutUsuarioAsignado)}
                              fullWidth
                              label='Seleccionar Responsable...'
                              variant='outlined'
                            />
                          )}
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option.UsuId}>
                                {option.UsuNombre} {option.UsuApellido}
                              </li>
                            )
                          }}
                        />
                      )}
                    />
                    {errorsTicket.RutUsuarioAsignado && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errorsTicket.RutUsuarioAsignado.message}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                <Grid item xs={12} sm={12}>
                  <Controller
                    name='Descripción'
                    control={controlTicket}
                    defaultValue={''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label='Descripción'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errorsTicket.Descripción)}
                        placeholder='Descripción'
                        id='textarea-outlined-static'
                      />
                    )}
                  />
                  {errorsTicket.Descripción && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errorsTicket.Descripción.message}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps({ className: 'dropzone' })}
                    sx={
                      files.length
                        ? {
                            height: 120,
                            width: '100%',
                            border: '5px dashed #DBDBDD',
                            padding: '4px',
                            display: 'flex',
                            justifyContent: 'center'
                          }
                        : { border: '5px dashed #DBDBDD', padding: '4px' }
                    }
                  >
                    <input {...getInputProps()} />
                    {files.length ? (
                      <Box sx={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        width: '100%',
                      }}>
                        <List>{fileList}</List>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: ['column', 'column', 'row'],
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Img width={200} alt='Upload img' src='/images/misc/upload.png' />
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: ['center', 'center', 'inherit']
                          }}
                        >
                          <HeadingTypography variant='h6'>Ingreso de documentos</HeadingTypography>
                          <Typography color='textSecondary'>Arrastra el archivo aquí o haz un click </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' sx={{ mr: 2 }} type='submit' color='success'>
              <Save sx={{ mr: 1 }} /> Ingresar
            </Button>
            <Button variant='outlined' color='secondary' onClick={cerrarModal}>
              Cancelar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
