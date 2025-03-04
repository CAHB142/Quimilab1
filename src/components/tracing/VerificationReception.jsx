import { Button, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from '@mui/icons-material/Check';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect } from "react";
import { useState } from "react";
import WasteInfo from "../Statements/WasteInfo";
import { useAuth } from "../../hooks/AuthContextUsuarios";
import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";
import VerificationReceptionForm from "./VerificationReceptionForm";
import { useAuthStatement } from "../../hooks/AuthContextStatements";
import { useAuthTracing } from "../../hooks/AuthContextTracing";

const VerificationRecepcion = ({ info, setOpenStatementProp, setAlert }) => {

    const [openStatement, setOpenStatement] = useState(false)
    const [itemSelected, setItemSelected] = useState(null)
    const { user, getUserById } = useAuth()
    const { laboratorio, getLabById } = useAuthLaboratorio()
    const { getCorrientes, getCorrienteById, corriente, corrientes, waste } = useAuthStatement()
    const { addVerificationSchedule, addVerification, addReception } = useAuthTracing()
    const [revisiones, setRevisiones] = useState(info.residuos)
    const [resSelected, setResSelected] = useState()
    const [residuos, setResiduos] = useState([])
    const [statementInfo, setStatementInfo] = useState(info)

    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "rgba(0,0,0,0.8)",
            color: 'white',
            fontSize: 16,
        },
    }));

    const reactives = (index) => {
        let string = '';
        info.residuos[index].reactivos.forEach(element => {
            string += element.Nombre + ", "
        });
        string = string.slice(0, string.lastIndexOf(","));
        return string;
    }

    const openDialogWaste = (index) => {
        if (new Date().getDate() == new Date(info.fecha_verificacion).getDate()) {
            alert(`La revisión se habilita el día ${new Date(info.fecha_creacion.seconds * 1000).toLocaleDateString("es-CO")}`)
        } else {
            console.log(itemSelected)
            console.log(info.residuos[index])
            setItemSelected(info.residuos[index])
            setResSelected(index)
            getCorrientes()
            console.log(revisiones);
            setOpenStatement(true);
        }
    };

    const handleCloseWaste = () => {
        setOpenStatement(false);
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

    const addRevisiones = () => {
        const newObj = {
            idDeclaracion: info.id,
            etapa: info.etapa,
            residuos: revisiones,
        }
        console.log(newObj);
        if (info.etapa == 2) {
            const revisados = newObj.residuos.filter(r => r.revisado === true)
            if (revisados.length === info.residuos.length) {
                addVerification(newObj)
                setAlert({ state: true, message: 'Se han guardado los cambios', error:false })
                setOpenStatementProp(false)
            } else {
                setAlert({ state: true, message: 'Debe revisar todos los residuos', error: true })
            }
        } else if (info.etapa == 4) {
            const revisados = newObj.residuos.filter(r => r.recibido === true)
            if (revisados.length === info.residuos.length) {
                console.log("addReception");
                addReception(newObj)
                setAlert({ state: true, message: 'Recepción exitosa', error:false})
                setOpenStatementProp(false)
            } else {
                setAlert({ state: true, message: 'Debe revisar todos los residuos', error: true })
            }
        }
        // if (revisiones.length == info.residuos.length) {
        //     revisiones.forEach(element => {
        //         addVerificationSchedule(element)
        //     })
        // }
        //addVerificationSchedule(revisiones[0])
        // console.log(revisiones);
    }

    useEffect(() => {
        getCorrientes()
        getLabById(info.id_laboratorio)
    }, [info])

    return (
        <Container sx={{ border: 1 }}>
            {residuos && <Grid container sx={{ px: 3, pt: 1 }} spacing={1}>
                <Grid item xs={12} md={6} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Información de la declaración</Typography>
                    <Typography variant="body1"><b>Etapa:</b> {statementInfo.etapa == 1? "Agenda verificación":statementInfo.etapa == 2? "Verificación": statementInfo.etapa == 3? "Agenda recepción": statementInfo.etapa == 4? "Recepción" : "Finalizada"}</Typography>
                    <Typography variant="body1"><b>Fecha declaración:</b> {new Date(statementInfo.fecha_creacion.seconds * 1000).toLocaleDateString("es-CO")}</Typography>
                    <Typography variant="body1"><b>Fecha revisión:</b> {statementInfo.fecha_verificacion ? new Date(statementInfo.fecha_verificacion.seconds * 1000).toLocaleDateString("es-CO") : 'NA'}</Typography>
                    <Typography variant="body1"><b>Fecha recepción:</b> {statementInfo.fecha_recepcion ? new Date(statementInfo.fecha_recepcion.seconds * 1000).toLocaleDateString("es-CO") : 'NA'}</Typography>
                    <Typography variant="body1"><b>Fecha finalización:</b> {statementInfo.fecha_finalizacion ? new Date(statementInfo.fecha_finalizacion.seconds * 1000).toLocaleDateString("es-CO") : 'NA'}</Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Información del generador</Typography>
                    <Typography variant="body1"><b>Responsable:</b> {user?.nombre + " " + user?.apellidos}</Typography>
                    <Typography variant="body1"><b>Email:</b> {user?.email}</Typography>
                    <Typography variant="body1"><b>Espacio físico:</b> {laboratorio?.nombreLaboratorio + " - " + laboratorio?.ubicacionFisica}</Typography>
                </Grid>
                <Divider sx={{ width: "100%", mb: 2, bgcolor: "black" }} />
                <Grid item xs={12} md={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Componentes</TableCell>
                                    <TableCell>Peso (kg)</TableCell>
                                    <TableCell>Estado fisicoquímico</TableCell>
                                    <TableCell>Corriente</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {statementInfo.residuos.map((item, index) => (
                                    <TableRow
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{index}</TableCell>
                                        <TableCell sx={{ maxWidth: "300px", overflowX: "auto" }}>{reactives(index)}</TableCell>
                                        <TableCell>{item.cantidadGenerada}</TableCell>
                                        <TableCell>{item.estadoFQ}</TableCell>
                                        <TableCell>{corriente_(item.corriente)}</TableCell>
                                        <TableCell>
                                            <CustomTooltip title="Revisar residuo" placement="right-start">
                                            <IconButton
                                                color="info"
                                                size="small"
                                                sx={{
                                                    bgcolor: "white",
                                                }}
                                                variant="contained"
                                                onClick={() => openDialogWaste(index)}
                                            >
                                                <ContentPasteSearchIcon />
                                            </IconButton>
                                            </CustomTooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Divider sx={{ width: "100%", mt: 3, mb: 1, bgcolor: "black" }} />
                <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Button variant="contained" color="inherit" sx={{ p: 1, mx: 2, px: 2 }} onClick={()=>setOpenStatementProp(false)}>Cancelar</Button>
                    <Button variant="contained" color="success" sx={{ p: 1, mx: 2}} onClick={() => addRevisiones()}>Finalizar</Button>
                </Grid>
            </Grid>}
            <Dialog open={openStatement} onClose={() => handleCloseWaste()} fullWidth>
                <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => handleCloseWaste()}>X</Button>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Revisión de residuo
                </DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    <VerificationReceptionForm setOpenStatement={setOpenStatement} revisiones={revisiones} setRevisiones={setRevisiones} info={itemSelected} revSelected={resSelected} setStatementInfo={setStatementInfo} statementInfo={statementInfo} setAlert={setAlert}/>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default VerificationRecepcion;

/*

<Grid container sx={{ px: 3, pt: 3 }} spacing={1}>
                <Grid item xs={12} md={6} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Información de la declaración</Typography>
                    <Typography variant="body1">Etapa: {info.etapa}</Typography>
                    <Typography variant="body1">Fecha declaración: {new Date(info.fecha_creacion.seconds * 1000).toLocaleDateString("es-CO")}</Typography>
                    <Typography variant="body1">Fecha revisión: {info.fecha_verificacion ? new Date(info.fecha_verificacion.seconds * 1000).toLocaleDateString("es-CO") : ''}</Typography>
                    <Typography variant="body1">Fecha recepción: {info.fecha_revision ? new Date(info.fecha_revision.seconds * 1000).toLocaleDateString("es-CO") : ''}</Typography>
                    <Typography variant="body1">Fecha finalización: {info.fecha_recepcion ? new Date(info.fecha_recepcion.seconds * 1000).toLocaleDateString("es-CO") : ''}</Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Información del generador</Typography>
                    <Typography variant="body1">Responsable: {user?.nombre + " " + user?.apellidos}</Typography>
                    <Typography variant="body1">Email: {user?.email}</Typography>
                    <Typography variant="body1">Espacio físico: {laboratorio?.nombreLaboratorio}</Typography>
                </Grid>
                <Divider sx={{ width: "100%", mb: 2, bgcolor: "black" }} />
                <Grid item xs={12} md={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Componentes</TableCell>
                                    <TableCell>Peso (kg)</TableCell>
                                    <TableCell>Estado fisicoquímico</TableCell>
                                    <TableCell>Corriente</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {residuos?.map((item, index) => (
                                    <TableRow
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{index}</TableCell>
                                        <TableCell sx={{ maxWidth: "300px", overflowX: "auto" }}>{reactives(index)}</TableCell>
                                        <TableCell>{item.cantidadGenerada}</TableCell>
                                        <TableCell>{item.estadoFQ}</TableCell>
                                        <TableCell>{corriente_(item.corriente)}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="info"
                                                size="small"
                                                sx={{
                                                    bgcolor: "white",
                                                }}
                                                variant="contained"
                                                onClick={() => openDialogWaste(index)}
                                            >
                                                <ContentPasteSearchIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" color="inherit" sx={{ mt: 3, p: 1, mx: 2 }}>Cancelar</Button>
                    <Button variant="contained" color="success" sx={{ mt: 3, p: 1, mx: 2 }} onClick={() => addRevisiones()}>Terminar revsion</Button>
                </Grid>
            </Grid>
            <Dialog open={openStatement} onClose={() => handleCloseWaste()} fullWidth>
                <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => handleCloseWaste()}>X</Button>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Revisión de residuo
                </DialogTitle>
                <DialogContent sx={{p:2}}>
                    <VerificationReceptionForm setOpenStatement={setOpenStatement} revisiones={revisiones} setRevisiones={setRevisiones} info={itemSelected} revSelected={resSelected}/>
                </DialogContent>
            </Dialog>
*/