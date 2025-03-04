import React, { useState } from "react";
import { Autocomplete, Box, Button, Container, Grid, Snackbar, TextField } from "@mui/material";//
import MuiAlert from '@mui/material/Alert';
import {useAuthRequest} from "../../hooks/AuthContextRequest" 
import {useAuthLaboratorio} from "../../hooks/AuthContextLaboratorios"

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
    color:"#dc3545",
}

const RequestForm = ({params}) =>{

    const [openAlerRequest, setOpenAlertRequest] = useState(false);
    const [error,setError] = useState({});
    const {addDataRequest} =useAuthRequest()
    const { laboratorios } =useAuthLaboratorio();

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertRequest(false);
    }; 

    const [crearSolicitud, setCrearSolicitud] = useState({
        fechaRegistroSolicitud:"",
        nombreReactivoSolicitud:params.nomReactivo.Nombre,
        cantidadSolicitud:"",
        responsableSolicitud:"",
        telefonoSolicitud:"",
        lugarSolicitud:[],
    });

    const handleChangeLugar = ({target: {id, value}}, p=0) =>{ 
      if(id && id.includes("lugarSolicitud-option-")){
        let newArray = [...crearSolicitud.lugarSolicitud]
        newArray.push(p)
        setCrearSolicitud({...crearSolicitud, lugarSolicitud: newArray.pop()}) 
      }
    };

    const handleChange = ({target: {name, value}}) =>{ 
        setCrearSolicitud({...crearSolicitud,[name]:value})
    };

    const handleBlur = (e) =>{
        handleChange(e);
        setError(validate(crearSolicitud));
    }

    const handleSubmit = async(e) =>{
      e.preventDefault();
        setError(validate(crearSolicitud));
        if(Object.keys(error).length ===0){
          try{
            await addDataRequest(crearSolicitud.fechaRegistroSolicitud, crearSolicitud.nombreReactivoSolicitud,crearSolicitud.cantidadSolicitud, crearSolicitud.responsableSolicitud, crearSolicitud.telefonoSolicitud, crearSolicitud.lugarSolicitud)
            setCrearSolicitud({
                fechaRegistroSolicitud:"",
                nombreReactivoSolicitud:[],
                cantidadSolicitud:"",
                responsableSolicitud:"",
                telefonoSolicitud:"",
                lugarSolicitud:[],
            });
            setOpenAlertRequest(true);
            console.log("se registro la solitud")
          }catch(error){
            setError({
              error: true,
              text:"Problemas con el registro",
            });                
          }
          return;
        } 
    }
    
    const validate= (values)=> {
        const errors = {}
        if(!values.fechaRegistroSolicitud){
          errors.fechaRegistroSolicitud = "Este campo es requerido"
        }if(!values.cantidadSolicitud){
          errors.cantidadSolicitud = "Este campo es requerido"
        }if(!values.responsableSolicitud){
          errors.responsableSolicitud = "Este campo es requerido"
        }if(!values.telefonoSolicitud){
          errors.telefonoSolicitud = "Este campo es requerido"
        }else if(values.telefonoSolicitud.length < 7){
          errors.telefonoSolicitud = "El campo teléfono debe tener más de 7 dígitos"
        }else if(values.telefonoSolicitud.length > 10){
          errors.telefonoSolicitud = "El campo teléfono no puede tener más de 10 digitos"
        }

        return errors;    
    };   

    return (
        <Container>
            <Box sx={{ width: "100%" }}>
                <Grid container sx={{ p: 1 }} spacing={1}>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} value={crearSolicitud.fechaRegistroSolicitud} fullWidth type="date" name="fechaRegistroSolicitud" id="fechaRegistroSolicitud" onChange={handleChange}/>
                        {error.fechaRegistroSolicitud && <p style={sytles}>{error.fechaRegistroSolicitud}</p>}
                    </Grid>
                    <Grid item xs={12} >  
                    <TextField required onBlur={handleBlur} disabled value={crearSolicitud.nombreReactivoSolicitud} fullWidth name="nombreReactivoSolicitud" id="nombreReactivoSolicitud" onChange={handleChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" value={crearSolicitud.cantidadSolicitud} fullWidth label="Cantidad Solicitada" name="cantidadSolicitud" onChange={handleChange}/>
                        {error.cantidadSolicitud && <p style={sytles}>{error.cantidadSolicitud}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} value={crearSolicitud.responsableSolicitud} fullWidth label="Nombre del solicitante" name="responsableSolicitud" onChange={handleChange}/>
                        {error.responsableSolicitud && <p style={sytles}>{error.responsableSolicitud}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type="number" required onBlur={handleBlur} value={crearSolicitud.telefonoSolicitud} fullWidth label="Teléfono del solicitante " name="telefonoSolicitud" onChange={handleChange}/>
                        {error.telefonoSolicitud && <p style={sytles}>{error.telefonoSolicitud}</p>}
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        id="lugarSolicitud"
                        fullWidth
                        onChange={handleChangeLugar}
                        options={laboratorios}
                        getOptionLabel={(option) => option.nombreLaboratorio }
                        filterSelectedOptions
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Nombre del laboratorio"
                        />                            
                        )}
                      />  
                    </Grid>
                    <Grid item xs={12} sx={{textAlign:"center" }}>
                        <Button type="submit" onClick={handleSubmit} variant="contained"  sx={{width:"100%", bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>ENVIAR</Button>
                    </Grid>
                </Grid>
                <Snackbar open={openAlerRequest} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                    <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Solicitud registrada correctamente!
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    )
}

export default RequestForm;
