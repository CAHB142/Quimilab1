import { Container, Divider, FormControl, Grid, IconButton, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect } from "react";
import { useState } from "react";
import { useAuthStatement } from "../../hooks/AuthContextStatements";

const WasteInfo = ({ info }) => {
    const { getCorrienteById, corriente } = useAuthStatement();
    const colorText = "rgb(90,90,90)"
    const reactives = () => {
        let string = '';
        info.reactivos.forEach(element => {
            string += element.Nombre + ", "
        });
        string = string.slice(0, string.lastIndexOf(","));
        return string;
    }

    useEffect(() => {
        console.log(info);
        getCorrienteById(info.corriente)
    }, [])

    return (
        <Container sx={{ border: 1 }}>
            {/* <Grid container>
                <Grid item xs={12} md={12} sx={{ mb: 1, textAlign:"" }}>
                    <Typography variant="body1"><b>Corriente:</b> {corriente?.tipo} - {corriente?.clasificacionBasilea} - {corriente?.clasfRes11642002}</Typography>
                    <Typography variant="body1"><b>Unidades:</b> {info.unidades}</Typography>
                    <Typography variant="body1"><b>Peso(kg):</b> {info.cantidadGenerada}</Typography>
                    <Typography variant="body1"><b>Estado Fisicoquimico:</b> {info.estadoFQ}</Typography>
                    <Typography variant="body1"><b>Tipo de recipiente:</b> {info.tipoEmbalaje}</Typography>
                    <Typography variant="body1"><b>Reactivos:</b> {reactives()}</Typography>
                    <Typography variant="body1"><b>Inflamable:</b> {info.inflamable == true? "Si":"No"}</Typography>
                    <Typography variant="body1"><b>Observaciones:</b> {info.descripcion}</Typography>
                </Grid>
            </Grid> */}
            <Grid container sx={{ pt: 1 }} spacing={1}>
                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Características
                    </Typography>
                </Grid>
                <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
                <Grid item xs={12} md={12} sx={{ mt: 1 }}>
                    <Typography variant="body1"><b>Nombre:</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.nombre}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 1 }}>
                    <Typography variant="body1"><b>Prueba o ensayo:</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.prueba.nombre}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{}}>
                    <Typography variant="body1"><b>Corriente:</b></Typography>
                    <Typography variant="body1" color={colorText}>{corriente?.clasificacionBasilea} - {corriente?.clasfRes11642002} - {corriente?.proceso} - {corriente?.descripcionProceso}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{}}>
                    <Typography variant="body1"><b>Reactivos:</b></Typography>
                    <Typography variant="body1" color={colorText}>{reactives()}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{}}>
                    <Typography variant="body1"><b>Peso(kg):</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.cantidadGenerada}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                        Embalaje del residuo
                    </Typography>
                </Grid>
                <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
                <Grid item xs={12} md={4} sx={{ my: 2 }}>
                    <Typography variant="body1"><b>Unidades:</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.unidades}</Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ my: 2 }}>
                    <Typography variant="body1"><b>Tipo de embalaje:</b> </Typography>
                    <Typography variant="body1" color={colorText}>{info.tipoEmbalaje}</Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ my: 2 }}>
                    <Typography variant="body1"><b>Material:</b> </Typography>
                    <Typography variant="body1" color={colorText}>{info.material}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                        Características Fisicoquímicas
                    </Typography>
                </Grid>
                <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
                <Grid item xs={12} md={4} sx={{ my: 2 }}>
                    <Typography variant="body1"><b>Estado Fisicoquimico:</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.estadoFQ}</Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ my: 2, mx: 2 }}>
                    <Typography variant="body1"><b>Inflamable:</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.inflamable == true ? "Si" : "No"}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{ my: 2 }}>
                    <Typography variant="body1"><b>Observaciones:</b></Typography>
                    <Typography variant="body1" color={colorText}>{info.descripcion}</Typography>
                </Grid>
                <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
                {(info.etapa == 3 || info.etapa == 5) && <>
                    <Grid item xs={12} md={4} sx={{ my: 2 }}>
                        <Typography variant="body1"><b>Destino:</b></Typography>
                        <Typography variant="body1" color={colorText}>{info.destino}</Typography>
                    </Grid>
                    {info.tratamiento &&
                        <Grid item xs={12} md={4} sx={{ my: 2, mx: 2 }}>
                            <Typography variant="body1"><b>Tratamiento:</b></Typography>
                            <Typography variant="body1" color={colorText}>{info.tratamiento}</Typography>
                        </Grid>
                    }
                </>
                }
                {(info.etapa == 3 || info.etapa == 5) &&
                    <Grid item xs={12} md={12} sx={{ my: 2 }}>
                        <Typography variant="body1"><b>Comentarios de revisión:</b></Typography>
                        <Typography variant="body1" color={colorText}>{info.comentario_revision ? info.comentario_revision : "No hay comentarios"}</Typography>
                    </Grid>
                }
                {info.etapa == 5 &&
                    <Grid item xs={12} md={12} sx={{ my: 2 }}>
                        <Typography variant="body1"><b>Comentarios de recepción:</b></Typography>
                        <Typography variant="body1" color={colorText}>{info.comentario_recepcion ? info.comentario_recepcion : "No hay comentarios"}</Typography>
                    </Grid>
                }
            </Grid>
        </Container>
    );
}

export default WasteInfo;
