/* eslint-disable react-hooks/exhaustive-deps */
import {useRouter} from 'next/router'
import {useEffect, useState, SyntheticEvent} from 'react'
import {instanceMiddlewareApi} from 'src/axios'
import {decryptText} from 'src/helpers'
import UserSpinner from 'src/layouts/components/UserSpinner'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {Card, Box, styled} from '@mui/material'
import MuiTab from '@mui/material/Tab'
import {
    AccountOutline,
    LockOpenOutline
} from 'mdi-material-ui'
import CardPerfil from 'src/components/administracion/perfil/CardPerfil'
import CardChangePassword from 'src/components/administracion/perfil/CardChangePassword'
import { ITblUsuario } from 'src/interfaces'

const Tab = styled(MuiTab)(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        minWidth: 100
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: 67
    }
}))

const TabName = styled('span')(({theme}) => ({
    lineHeight: 1.71,
    marginLeft: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}))

const PerfilPage = () => {
    const router = useRouter()
    const [cargando, setCargando] = useState<boolean>(true)
    const [value, setValue] = useState<string>('perfil')
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<ITblUsuario | null>(null)

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    const obtenerId = async () => {
        try {
            setCargando(true)
            if (router.query.id && router.query.id != null) {
                const idUsuario = decryptText(router.query.id)
                if (idUsuario && idUsuario != null) {
                    const {data : ListadoUsuarios} = await instanceMiddlewareApi.get('/Usuarios/ObtenerUsuarios')
                    if(ListadoUsuarios.Data){
                    const usuarioPerfil = ListadoUsuarios.Data.find((x : ITblUsuario) => x.UsuId == idUsuario)
                    setUsuarioSeleccionado(usuarioPerfil ?? null)
                    }
                }
            } else {
                console.log('Descripción del error: Problemas ID Usuario')
            }
        } catch (error) {
            console.error('Descripción error:', error)

            return null
        }finally{
            setCargando(false)
        }
    }

    useEffect(() => {
        const inicializar = async () => {
            if (router.query.id != null) {
                obtenerId()
            }
        }
        inicializar()
    }, [router.query.id])

    return cargando ? (
        <UserSpinner/>
    ) : (
        <Card>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label='account-settings tabs'
                    sx={{borderBottom: theme => `1px solid ${theme.palette.divider}`}}
                >
                    <Tab
                        value='perfil'
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <AccountOutline sx={{fontSize: '1.125rem'}}/>
                                <TabName>Perfil Usuario</TabName>
                            </Box>
                        }
                    />
                    <Tab
                        value='password'
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <LockOpenOutline sx={{fontSize: '1.125rem'}}/>
                                <TabName>Contraseña</TabName>
                            </Box>
                        }
                    />
                </TabList>

                <TabPanel sx={{p: 0}} value='perfil'>
                    <CardPerfil usuario={usuarioSeleccionado}/>
                </TabPanel>
                <TabPanel sx={{p: 0}} value='password'>
                    <CardChangePassword/>
                </TabPanel>
            </TabContext>
        </Card>
    )
}

PerfilPage.acl = {
    action: 'read',
    subject: 'ADM'
}

export default PerfilPage
