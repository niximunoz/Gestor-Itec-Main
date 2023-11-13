import { ReactElement, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ChevronUp from 'mdi-material-ui/ChevronUp';
import CustomAvatar from 'src/@core/components/mui/avatar';
import axios from 'axios';

import { AttachMoney, LocalAtm, Archive, Person } from '@mui/icons-material';

const CardIndicadores = () => {
    const [indicadores, setIndicadores] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: Res } = await axios.get('https://mindicador.cl/api');

                if (Res) {
                    const dataApi = [Res.dolar, Res.uf, Res.ipc, Res.utm];
                    setIndicadores(dataApi);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);


    const renderStats = () => {


        return indicadores.map((indicador: any, index: number) => (

            <Grid item xs={12} sm={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ mr: 4 }}>
                        {indicador.codigo === 'dolar' ? <AttachMoney /> : null}
                        {indicador.codigo === 'uf' ? <LocalAtm /> : null}
                        {indicador.codigo === 'ipc' ? <Person /> : null}
                        {indicador.codigo === 'utm' ? <Archive /> : null}
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'start' }} >
                            {indicador.codigo === 'utm' || indicador.codigo === 'uf' ? (
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                    {indicador.valor.toLocaleString('es-CL', {
                                        style: 'currency',
                                        currency: 'CLP',
                                    })}
                                </Typography>
                            ) : (
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                    {indicador.valor}
                                </Typography>
                            )}
                            <ChevronUp fontSize='small' sx={{ color: 'success.main' }} />
                            <Typography variant='subtitle1' sx={{ color: 'success.main' }}>{`${indicador.fecha.split('T')[0]}`}</Typography>
                        </Box>
                        <Typography variant='caption'>{indicador.nombre}</Typography>
                    </Box>
                </Box>
            </Grid>
        ));
    };

    return (
        <Card sx={{ mb: 5, position: 'relative' }}>
            <CardContent>
                <Grid container spacing={6}>
                    {renderStats()}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CardIndicadores;
