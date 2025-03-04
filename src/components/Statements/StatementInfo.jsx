import { Button, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect } from "react";
import { useState } from "react";
import WasteInfo from "./WasteInfo";
import { useAuth } from "../../hooks/AuthContextUsuarios";
import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";
import { useAuthStatement } from "../../hooks/AuthContextStatements";

const StatementInfo = ({ info }) => {
    const [openStatement, setOpenStatement] = useState(false)
    const [itemSelected, setItemSelected] = useState(null)
    const {user, getUserById} = useAuth()
    const {laboratorio, getLabById} = useAuthLaboratorio()
    const {getCorrienteById, corrientes} = useAuthStatement()

    const reactives = (index) => {
        let string = '';
        info.residuos[index].reactivos.forEach(element => {
            string += element.Nombre + ", "
        });
        string = string.slice(0, string.lastIndexOf(","));
        return string;
    }

    const openDialogWaste = (index) => {
        console.log(itemSelected)
        console.log(info.residuos[index])
        setItemSelected({...info.residuos[index], etapa: info.etapa})
        setOpenStatement(true);
    };

    const corriente_ = (id) => {
        const itemEncontrado = corrientes?.find(cor => cor.id === id);
        if (itemEncontrado) {
            const res = `${itemEncontrado?.clasificacionBasilea} - ${itemEncontrado?.clasfRes11642002}`;
            return res
        } else {
            return "No existe"
        }
    }

    const handleCloseWaste = () => {
        setOpenStatement(false);
    };

    useEffect(() => {
        getLabById(info.id_laboratorio)
    }, [info])
    
    return (
        <Container>
            <Grid container sx={{ p: 3 }} spacing={1}>
                <Grid item xs={12} md={6} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Información de la declaración</Typography>
                    <Typography variant="body1"><b>Etapa:</b> {info.etapa == 1? "Agenda verificación":info.etapa == 2? "Verificación": info.etapa == 3? "Agenda recepción": info.etapa == 4? "Recepción" : "Finalizada"}</Typography>
                    <Typography variant="body1"><b>Fecha declaración:</b> {info.fecha_creacion? `${new Date(info.fecha_creacion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(info.fecha_creacion?.seconds * 1000).toLocaleTimeString()}`:'NA'}</Typography>
                    <Typography variant="body1"><b>Fecha revisión:</b> {info.fecha_verificacion ? `${new Date(info.fecha_verificacion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(info.fecha_verificacion?.seconds * 1000).toLocaleTimeString()}` : 'NA'}</Typography>
                    <Typography variant="body1"><b>Fecha recepción:</b> {info.fecha_recepcion ? `${new Date(info.fecha_recepcion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(info.fecha_recepcion?.seconds * 1000).toLocaleTimeString()}` : 'NA'}</Typography>
                    <Typography variant="body1"><b>Fecha finalización:</b> {info.fecha_finalizacion ? `${new Date(info.fecha_finalizacion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(info.fecha_finalizacion?.seconds * 1000).toLocaleTimeString()}` : 'NA'}</Typography>
                    <Typography variant="body1"><b>Responsable de entrega:</b> {info.responsableEntrega}</Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Información del generador</Typography>
                    <Typography variant="body1"><b>Responsable:</b> {user?.nombre + " " + user?.apellidos}</Typography>
                    <Typography variant="body1"><b>Email:</b> {user?.email}</Typography>
                    <Typography variant="body1"><b>Espacio físico:</b> {laboratorio?.nombreLaboratorio+" - "+laboratorio?.ubicacionFisica}</Typography>
                </Grid>
                <Divider sx={{ width: "100%", mb: 2, bgcolor: "black" }} />
                <Grid item xs={12} md={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Componentes</TableCell>
                                    <TableCell>Cant. generada (kg)</TableCell>
                                    <TableCell>Estado fisicoquímico</TableCell>
                                    <TableCell>Corriente</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {info.residuos.map((item, index) => (
                                    <TableRow
                                        key={info.id_declaracion + index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{index}</TableCell>
                                        <TableCell>{reactives(index)}</TableCell>
                                        <TableCell>{parseFloat(item.cantidadGenerada)}</TableCell>
                                        <TableCell>{item.estadoFQ}</TableCell>
                                        <TableCell>{corriente_(item.corriente)}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    bgcolor: "white",
                                                    color: "black",
                                                }}
                                                variant="contained"
                                                onClick={() => openDialogWaste(index)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog open={openStatement} onClose={() => handleCloseWaste()} maxWidth="md">
                <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => handleCloseWaste()}>X</Button>
                <DialogTitle sx={{ textAlign: "center", borderBottom:0 }}>
                    Información de residuo
                </DialogTitle>
                <DialogContent sx={{}}>
                    <WasteInfo info={itemSelected} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default StatementInfo;
