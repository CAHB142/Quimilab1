/*CREATE USUARIO MODIFICADO*/

import { Autocomplete, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import React, { useState } from "react";
import MuiAlert from '@mui/material/Alert';

import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
  color:"#dc3545",
}

const CreateUsuariosForm = ({onAdd}) => {
  const [openAler, setOpenAlert] = useState(false);
  const [error,setError] = useState({});
  const [mostrarCampo, setMostrarCampo] = useState('');
  const { laboratorios} = useAuthLaboratorio();

  const handleShowCampo = ()=>{setMostrarCampo(true);}

  const handleHideCampo = ()=>{setMostrarCampo(false);}

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  }; 
  
  const [ingresaUsuario, setUsuario] = useState({
    nombre: "",
    apellidos: "",
    tipoDocumento: "",
    numDocumento: "",
    telefono: "",
    email: "",
    cargo: "",
    rol: "",
    password:"",
    password2:"",
    asigLaboratorios:[],
  });

  /*const submit =()=>{
    console.log(ingresarInventarios)
  }*/

  const handleChangeLaboratorio = ({target: {id, value}}, p=0) =>{ 
    if(id && id.includes("asigLaboratorios-option-")){
      let newArray = [...ingresaUsuario.asigLaboratorios]
      newArray.push(p)
      setUsuario({...ingresaUsuario, asigLaboratorios: newArray.pop()}) 
    }
  };

  const handleChange = ({target: {name, value}}) =>{ 
    setUsuario({...ingresaUsuario,[name]:value})
  };

  const handleBlur = (e) =>{
    handleChange(e);
    setError(validate(ingresaUsuario));
  }
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError(validate(ingresaUsuario));
    if(Object.keys(error).length ===0){
      try{
        await onAdd(ingresaUsuario.email,ingresaUsuario.password,ingresaUsuario.nombre, ingresaUsuario.apellidos,  ingresaUsuario.tipoDocumento, ingresaUsuario.numDocumento, ingresaUsuario.telefono, ingresaUsuario.cargo, ingresaUsuario.rol, ingresaUsuario.asigLaboratorios )
        setUsuario({
          nombre: "",
          apellidos: "",
          tipoDocumento: "",
          numDocumento: "",
          telefono: "",
          email: "",
          cargo: "",
          rol: "",
          password:"",
          password2:"",
          asigLaboratorios:[],
        });
        setOpenAlert(true);
        console.log("se registro el usuario")
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
    const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    const regexEmail = /^[A-Z0-9._%+-]+@[correounivalle]+\.[edu]+\.[co]/i;

    if(!values.nombre){
      errors.nombre = "Este campo es requerido"
    }else if(!regexName.test(values.nombre)){
      errors.nombre = "Este campo sólo acepta letras y espacios en blanco"
    }if(!values.apellidos){
      errors.apellidos = "Este campo es requerido"
    }else if(!regexName.test(values.apellidos)){
      errors.apellidos = "Este campo sólo acepta letras y espacios en blanco"
    }if(!values.tipoDocumento){
      errors.tipoDocumento = "Este campo es requerido"
    }if(!values.numDocumento){
      errors.numDocumento = "Este campo es requerido"
    }if(!values.telefono){
      errors.telefono = "Este campo es requerido"
    }else if(values.telefono.length < 7){
      errors.telefono = "El campo teléfono debe tener más de 7 dígitos"
    }else if(values.telefono.length > 10){
      errors.telefono = "El campo teléfono no puede tener más de 10 digitos"
    }if(!values.email){
      errors.email = "Este campo es requerido"
    }else if(!regexEmail.test(values.email)){
      errors.email= "El campo email solo acepta correo institucional"
    }if(!values.cargo){
      errors.cargo = "Este campo es requerido"
    }if(!values.rol){
      errors.rol= "Este campo es requerido"
    }if(!values.password){
      errors.password = "Este campo es requerido"
    }if(!values.password2){
      errors.password2 = "Este campo es requerido"
    }
    return errors;   
  };

  return (
    <Container>
      <Box sx={{ width: "100%" }}>
          <Grid container rowSpacing={2}  sx={{ my: 1}} columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
            <Grid item xs={4}>
                <TextField required onBlur={handleBlur} value={ingresaUsuario.nombre} fullWidth label="Nombres" name="nombre" id="nombre" onChange={handleChange}/>
                {error.nombre && <p style={sytles}>{error.nombre}</p>}
            </Grid>
            <Grid item xs={4}>
                <TextField required onBlur={handleBlur} value={ingresaUsuario.apellidos} fullWidth label="Apellidos" name="apellidos" id="apellidos" onChange={handleChange}/>
                {error.apellidos && <p style={sytles}>{error.apellidos}</p>}
            </Grid>
            <Grid item xs={4} >
              <FormControl fullWidth required onBlur={handleBlur} >
                  <InputLabel id="select-label">Tipo de Documento</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="tipoDocumento"
                    label="Tipo de documento"
                    name="tipoDocumento"
                    value={ingresaUsuario.tipoDocumento}
                    onChange={handleChange}>
                      <MenuItem value={"Cedula"}>Cédula de Ciudadania</MenuItem>
                      <MenuItem value={"Pasaporte"}>Pasaporte</MenuItem>
                      <MenuItem value={"Carnet"}>Carnet</MenuItem>
                  </Select>
                </FormControl>  
                {error.tipoDocumento && <p style={sytles}>{error.tipoDocumento}</p>}        
            </Grid>
            <Grid item xs={3.5}>
                <TextField  type="number" required onBlur={handleBlur} value={ingresaUsuario.numDocumento} fullWidth label="Número de documento" name="numDocumento" id="numDocumento" onChange={handleChange}/>
                {error.numDocumento && <p style={sytles}>{error.numDocumento}</p>}
            </Grid>
            <Grid item xs={3}>
                <TextField  type="number" required onBlur={handleBlur} value={ingresaUsuario.telefono} fullWidth label="Télefono" name="telefono" id="telefono" onChange={handleChange}/>
                {error.telefono && <p style={sytles}>{error.telefono}</p>}
            </Grid>
            <Grid item xs={5.5}>
                <TextField required onBlur={handleBlur} value={ingresaUsuario.email} fullWidth label="Correo electrónico" name="email" id="email" onChange={handleChange}/>
                {error.email && <p style={sytles}>{error.email}</p>}
            </Grid>
            <Grid item xs={3}>
                <FormControl fullWidth required onBlur={handleBlur} >
                  <InputLabel id="select-label" >Rol</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="rol"
                    label="Rol"
                    name="rol"
                    value={ingresaUsuario.rol}
                    onChange={handleChange}>
                          <MenuItem onClick={handleHideCampo} value={"Administrador"}>Administrador</MenuItem>
                          <MenuItem onClick={handleHideCampo} value={"Operador"}>Operador</MenuItem>
                          <MenuItem onClick={handleHideCampo} value={"Invitado"}>Invitado</MenuItem>
                          <MenuItem onClick={handleShowCampo} value={"Generador"}>Generador</MenuItem>
                  </Select>
                </FormControl>   
                {error.rol && <p style={sytles}>{error.rol}</p>}           
            </Grid>
            {mostrarCampo && <Grid item xs={5}>
              <Autocomplete
                  id="asigLaboratorios"
                  multiple
                  fullWidth
                  onChange={handleChangeLaboratorio}
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
                  </Grid>}
            <Grid item xs={4} >
              <FormControl fullWidth required onBlur={handleBlur} >
                  <InputLabel id="select-label">Cargo</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="cargo"
                    label="Cargo"
                    name="cargo"
                    value={ingresaUsuario.cargo}
                    onChange={handleChange}>
                      <MenuItem value={"Laboratorista"}>Laboratorista</MenuItem>
                      <MenuItem value={"Profesor"}>Profesor</MenuItem>
                      <MenuItem value={"Estudiante"}>Estudiante</MenuItem>
                      <MenuItem value={"Almacenista"}>Almacenista</MenuItem>
                      <MenuItem value={"Servicios"}>Servicios Varios</MenuItem>
                  </Select>
                </FormControl>  
                {error.cargo && <p style={sytles}>{error.cargo}</p>}        
            </Grid>
            <Grid item xs={5}>
              <TextField required type="password"  onBlur={handleBlur} value={ingresaUsuario.password} fullWidth label="Contraseña" name="password" id="password" onChange={handleChange}/>
              {error.password && <p style={sytles}>{error.password}</p>}
            </Grid>
            <Grid item xs={5}>
              <TextField required type="password"  onBlur={handleBlur} value={ingresaUsuario.password2} fullWidth label="Confirmar la contraseña" name="password2" id="password2" onChange={handleChange}/>
              {error.password2 && <p style={sytles}>{error.password2}</p>}
            </Grid>
            <Grid item xs={12} md={12} sx={{ my: 1.5 }}>
            </Grid>
            <Grid item xs={8} sx={{textAlign:"right" }} >
              <Button type="submit" onClick={handleSubmit} variant="contained"  sx={{width:"40%",bottom:"95%", bgcolor: "#FF0000", color: "white",
                "&:hover": { bgcolor: "#9d0000" },}}>Registrar</Button>
            </Grid>          
          </Grid>
          <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              Usuario Registrado Correctamente!
            </Alert>
          </Snackbar>
        </Box>
    </Container>

  );
};

export default CreateUsuariosForm;