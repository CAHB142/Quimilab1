import {
  Button,
  Grid,
  TextField,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  
} from "@mui/material";
import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
  color:"#dc3545",
}

const CreateLaboratoriosForm = ({onAdd}) => {
  const [openAler, setOpenAlert] = useState(false);
  const [error,setError] = useState({});

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };  

  const initialValues = {
    fechaRegistro: "",
    nombreLaboratorio: "",
    facultad:"",
    ubicacionFisica:"",
    coordinador: "",
    telefono: "",
    email: "",}
  const [ingresarLaboratorios, setLaboratorios] = useState({initialValues});

  const handleChange = ({target: {name, value}}) =>{ 
    setLaboratorios({...ingresarLaboratorios,[name]:value})
  };

  const handleBlur = (e) =>{
    handleChange(e);
    setError(validate(ingresarLaboratorios));
  }
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError(validate(ingresarLaboratorios));
    if(Object.keys(error).length ===0){
      try{
        await onAdd(ingresarLaboratorios.fechaRegistro, ingresarLaboratorios.nombreLaboratorio, ingresarLaboratorios.facultad, ingresarLaboratorios.ubicacionFisica, ingresarLaboratorios.coordinador, ingresarLaboratorios.telefono, ingresarLaboratorios.email)
        setLaboratorios({
          fechaRegistro: "",
          nombreLaboratorio: "",
          facultad:"",
          ubicacionFisica:"",
          coordinador: "",
          telefono: "",
          email: "",
        });
        setOpenAlert(true);
      }catch(error){
        console.log(error.Code);
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
    const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    const regexEmail = /^[A-Z0-9._%+-]+@[correounivalle]+\.[edu]+\.[co]/i;
    
    if(!values.fechaRegistro){
      errors.fechaRegistro = "Este campo es requerido"
    } if(!values.nombreLaboratorio){
      errors.nombreLaboratorio = "Este campo es requerido"
    }if(!values.facultad){
      errors.facultad = "Este campo es requerido"
    }if(!values.ubicacionFisica){
      errors.ubicacionFisica = "Este campo es requerido"
    }if(!values.coordinador){
      errors.coordinador = "Este campo es requerido"
    }else if(!regexName.test(values.coordinador)){
      errors.coordinador = "Este campo sólo acepta letras y espacios en blanco"
    }if(!values.email){
      errors.email = "Este campo es requerido"
    }else if(!regexEmail.test(values.email)){
      errors.email = "Este no es un formato válido solo acepta correo institucional"
    }if(!values.telefono){
      errors.telefono = "Este campo es requerido"
    }else if(values.telefono.length < 7){
      errors.telefono = "Este campo debe tener más de 7 dígitos"
    }else if(values.telefono.length > 10){
      errors.telefono = "Este campo no puede tener más de 10 digitos"
    }
    return errors;
    
  };

  return (
      <Container >
      <Grid container sx={{ p: 1 }} spacing={1}>
        <Grid item xs={12}>
          <TextField  required onBlur={handleBlur} type="date" value={ingresarLaboratorios.fechaRegistro} fullWidth name="fechaRegistro"  onChange={handleChange}/>
          {error.fechaRegistro && <p style={sytles}>{error.fechaRegistro}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField required onBlur={handleBlur} value={ingresarLaboratorios.nombreLaboratorio} fullWidth label="Nombre del laboratorio" name="nombreLaboratorio" onChange={handleChange} />
          {error.nombreLaboratorio && <p style={sytles }>{error.nombreLaboratorio}</p>}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required onBlur={handleBlur}>
            <InputLabel id="select-label" >Facultad</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="facultad"
              label="Facultad del laboratorio"
              name="facultad"
              value={ingresarLaboratorios.facultad}
              onChange={handleChange}
              >
              <MenuItem value={"Ingenieria quimica"}>Ingenieria Química</MenuItem>
              <MenuItem value={"Departamento de quimica"}>Departamento de Química</MenuItem>
              <MenuItem value={"No aplica"}>No aplica</MenuItem>
            </Select>
          </FormControl>
          {error.facultad && <p style={sytles }>{error.facultad}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField required onBlur={handleBlur} value={ingresarLaboratorios.ubicacionFisica} fullWidth label="Ubicación fisica" name="ubicacionFisica" onChange={handleChange}/>
          {error.ubicacionFisica && <p style={sytles }>{error.ubicacionFisica}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField required onBlur={handleBlur} value={ingresarLaboratorios.coordinador} fullWidth label="Coordinador" name="coordinador" onChange={handleChange}/>
          {error.coordinador && <p style={sytles}>{error.coordinador}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField type="number" required onBlur={handleBlur} value={ingresarLaboratorios.telefono} fullWidth label="Teléfono" name="telefono" onChange={handleChange}/>
          {error.telefono && <p style={sytles}>{error.telefono}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField required onBlur={handleBlur} value={ingresarLaboratorios.email} fullWidth label="Email" name="email" onChange={handleChange}/>
          {error.email && <p style={sytles}>{error.email}</p>}
        </Grid>       
        <Grid item xs={12} sx={{textAlign:"center" }}>
          <Button type="submit" onClick={handleSubmit} variant="contained"  sx={{width:"100%", bgcolor: "#FF0000", color: "white",
            "&:hover": { bgcolor: "#9d0000" },}}>Registrar</Button>
        </Grid>
      </Grid>
      <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Laboratorio Registrado Correctamente!
        </Alert>
      </Snackbar>
    </Container>
    
  );
};

export default CreateLaboratoriosForm;