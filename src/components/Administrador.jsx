import * as React from 'react';
import { Box, Grid } from '@mui/material';
import imgQuimilabg from "../assets/img/imagenquimilab.png"
import { useAuth } from '../context/AuthContext';
import { useAuthLaboratorio } from '../hooks/AuthContextLaboratorios';
import { useAuthStatement } from '../hooks/AuthContextStatements';

const style = {
    position: 'absolute',
    top: '55%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid error.main',
    borderRadius: '2%',
    boxShadow: 24,
    p: 4,
};

export function Administrador() {

    const { usere } = useAuth()
    const { getData } = useAuthLaboratorio()
    const { getStatements, getWaste } = useAuthStatement()

    React.useEffect(() => {
        getWaste()
        getData()
        getStatements(usere.uid, usere.rol)
    }, [])

    return (
        <Box sx={style}>
            <Grid container direction="column" alignItems="center" justify="center" p={2}>
                <img src={imgQuimilabg} alt="Imagen nv" className="img" />
            </Grid>
        </Box>

    );
}

export default function Dashboard() {
    return <Administrador />;
}