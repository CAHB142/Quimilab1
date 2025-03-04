import {
    Button,
    Grid,
    TextField,
    Container,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
  } from "@mui/material";
  import React, { useState } from "react";
  import Snackbar from '@mui/material/Snackbar';
  import MuiAlert from '@mui/material/Alert';
  import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  const sytles ={
    color:"#dc3545",
  }
  
  const EditeUserForm = ({edit, params, updateData}) => {

    const [openAler, setOpenAlert] = useState(false);
    const { laboratorios } = useAuthLaboratorio();
    const {id} = params   
    const [newUser, setNewUser] = useState(params);
    const [error,setError] = useState({});

    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlert(false);
    }; 

    const handleChange = ({target: {name, value}}) =>{ 
      setNewUser({...newUser,[name]:value})
    };

    const handleAutocompleteChange = (event, newValue) => {
      setNewUser((newUser) => ({
        ...newUser,
        asigLaboratorios: newValue,
      }));
    }

    const handleBlur = (e) =>{
      handleChange(e);
      setError(validate(newUser));
    }
    
    const handleClickEdit = async(usuariosid) => {
      setError(validate(newUser));
      if(Object.keys(error).length ===0){
        await updateData(usuariosid, newUser.nombre, newUser.apellidos, newUser.tipoDocumento, newUser.numDocumento,newUser.telefono,newUser.email,newUser.cargo, newUser.rol, newUser.asigLaboratorios )      
        console.log("se edito")
      }
      setOpenAlert(true);
    };

    const validate= (values)=> {
      const errors = {}
      const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
      const regexEmail = /^[A-Z0-9._%+-]+@[correounivalle]+\.[edu]+\.[co]/i;
      
      if(!values.nombre){
        errors.nombre = "El campo nombre es requerido"
      }else if(!regexName.test(values.nombre)){
        errors.nombre = "El campo nombre sólo acepta letras y espacios en blanco"
      }if(!values.apellidos){
        errors.apellidos = "El campo apellido es requerido"
      }else if(!regexName.test(values.apellidos)){
        errors.apellidos = "El campo apellido sólo acepta letras y espacios en blanco"
      }if(!values.numDocumento){
        errors.numDocumento = "El campo documento es requerido"
      }if(!values.tipoDocumento){
        errors.tipoDocumento = "El campo tipo documento es requerido"
      }if(!values.telefono){
        errors.telefono = "El campo teléfono es requerido"
      }else if(values.telefono.length < 7){
        errors.telefono = "El campo teléfono debe tener más de 7 dígitos"
      }else if(values.telefono.length > 10){
        errors.telefono = "El campo teléfono no puede tener más de 10 digitos"
      }if(!values.email){
        errors.email = "El campo email es requerido"
      }else if(!regexEmail.test(values.email)){
        errors.email = "El campo email solo acepta correo institucional"
      }if(!values.cargo){
        errors.cargo = "El campo cargo es requerido"
      }if(!values.rol){
        errors.rol = "El campo rol es requerido"
      }

      return errors;   
    };


    return (
        <Container >
            <Grid container sx={{ p: 1 }} spacing={1}>    
              <Box sx={{ width: "100%" }}>
                <Grid container rowSpacing={2}  sx={{ my: 1}} columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
                  <Grid item xs={4}>
                    <TextField required onBlur={handleBlur} defaultValue={params.nombre} fullWidth label="Nombres " name="nombre" id="nombre" onChange={handleChange}/>
                    {error.nombre && <p style={sytles}>{error.nombre}</p>}
                  </Grid>
                  <Grid item xs={4}>
                    <TextField required onBlur={handleBlur} defaultValue={params.apellidos} fullWidth label="Apellidos" name="apellidos" onChange={handleChange}/>
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
                        defaultValue={params.tipoDocumento}
                        onChange={handleChange}>
                          <MenuItem value={"Cedula"}>Cédula de Ciudadania</MenuItem>
                          <MenuItem value={"Pasaporte"}>Pasaporte</MenuItem>
                          <MenuItem value={"Carnet"}>Carnet</MenuItem>
                      </Select>
                    </FormControl>  
                    {error.tipoDocumento && <p style={sytles}>{error.tipoDocumento}</p>}        
                  </Grid>
                  <Grid item xs={3.5}>
                      <TextField  type="number" required onBlur={handleBlur} defaultValue={params.numDocumento} fullWidth label="Número de documento" name="numDocumento" id="numDocumento" onChange={handleChange}/>
                      {error.numDocumento && <p style={sytles}>{error.numDocumento}</p>}
                  </Grid>
                  <Grid item xs={2.5}>
                      <TextField  type="number" required onBlur={handleBlur} defaultValue={params.telefono} fullWidth label="Télefono" name="telefono" id="telefono" onChange={handleChange}/>
                      {error.telefono && <p style={sytles}>{error.telefono}</p>}
                  </Grid>
                  <Grid item xs={6}>
                      <TextField required onBlur={handleBlur} defaultValue={params.email} fullWidth label="Correo electrónico" name="email" id="email" onChange={handleChange}/>
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
                        defaultValue={params.rol}
                        onChange={handleChange}>
                              <MenuItem value={"Administrador"}>Administrador</MenuItem>
                              <MenuItem value={"Operador"}>Operador</MenuItem>
                              <MenuItem value={"Invitado"}>Invitado</MenuItem>
                              <MenuItem value={"Generador"}>Generador</MenuItem>
                              <MenuItem value={"Almacenista"}>Almacenista</MenuItem>
                      </Select>
                    </FormControl>   
                    {error.rol && <p style={sytles}>{error.rol}</p>}           
                  </Grid>
                  <Grid item xs={5}>
                    <Autocomplete
                      id="asigLaboratorios"
                      multiple
                      fullWidth
                      defaultValue={params.asigLaboratorios}
                      onChange={handleAutocompleteChange}
                      options={laboratorios}
                      getOptionLabel={(option) => option.nombreLaboratorio}
                      renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre del laboratorio"
                      />)}
                    />
                    {error.asigLaboratorios && <p style={sytles}>{error.asigLaboratorios}</p>}             

                      </Grid>
                  <Grid item xs={4} >
                    <FormControl fullWidth required onBlur={handleBlur} >
                        <InputLabel id="select-label">Cargo</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="cargo"
                          label="Cargo"
                          name="cargo"
                          defaultValue={params.cargo}
                          onChange={handleChange}>
                            <MenuItem value={"Laboratorista"}>Laboratorista</MenuItem>
                            <MenuItem value={"Profesor"}>Profesor</MenuItem>
                            <MenuItem value={"Estudiante"}>Estudiante</MenuItem>
                            <MenuItem value={"Servicios"}>Servicios Varios</MenuItem>
                        </Select>
                      </FormControl>  
                      {error.cargo && <p style={sytles}>{error.cargo}</p>}             
                    </Grid>
                  <Grid item xs={8} sx={{textAlign:"right" }}>
                    <Button onClick={()=> handleClickEdit(id)} type="submit" fullWidth variant="contained" sx={{width:"50%", mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Editar</Button>
                  </Grid>                        
                </Grid>  
          </Box>
          <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              Usuario Editado Correctamente!
            </Alert>
          </Snackbar>         
        </Grid>
      </Container>
      
    );
  };
  
  export default EditeUserForm;