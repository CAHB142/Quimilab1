import {
    Button,
    Grid,
    TextField,
    Container,
 
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
  
  const CreatePruebasEnsayosForm = ({onAdd}) => {
    const [openAler, setOpenAlert] = useState(false);
    const [error,setError] = useState({});
  
    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlert(false);
    };  
  
    const initialValues = {
      nombre: "",
      centroCostos: "",
      tipoActividad: "",
    }
    const [ingresarPruebasEnsayos, setIngresarPruebasEnsayos] = useState({initialValues});
  
    const handleChange = ({target: {name, value}}) =>{ 
        setIngresarPruebasEnsayos({...ingresarPruebasEnsayos,[name]:value})
    };
  
    const handleBlur = (e) =>{
      handleChange(e);
      setError(validate(ingresarPruebasEnsayos));
    }
    
    const handleSubmit = async(e) =>{
      e.preventDefault();
      setError(validate(ingresarPruebasEnsayos));
      if(Object.keys(error).length ===0){
        try{
          await onAdd(ingresarPruebasEnsayos.nombre, ingresarPruebasEnsayos.centroCostos, ingresarPruebasEnsayos.tipoActividad)
          setIngresarPruebasEnsayos({
            nombre: "",
            centroCostos: "",
            tipoActividad: "",
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
      
      if(!values.nombre){
        errors.nombre = "El campo nombre del laboratorio es requerido"
      }else if(!regexName.test(values.nombre)){
        errors.nombre = "El campo nombre de laboratorio sólo acepta letras y espacios en blanco"
      }if(!values.centroCostos){
        errors.centroCostos = "El campo coordinador es requerido"
      }if(!values.tipoActividad){
        errors.tipoActividad = "El campo email es requerido"
      }

      return errors;
      
    };
  
    return (
        <Container >
        <Grid container sx={{ p: 1 }} spacing={1}>
          <Grid item xs={12}>
            <TextField  required onBlur={handleBlur} value={ingresarPruebasEnsayos.nombre} fullWidth label="Nombre de la prueba o ensayo" name="nombre"  onChange={handleChange}/>
            {error.nombre && <p style={sytles}>{error.nombre}</p>}
          </Grid>
          <Grid item xs={12}>
            <TextField required onBlur={handleBlur} value={ingresarPruebasEnsayos.centroCostos} fullWidth label="Centro de costos" name="centroCostos" onChange={handleChange} />
            {error.centroCostos && <p style={sytles }>{error.centroCostos}</p>}
          </Grid>
          <Grid item xs={12}>
            <TextField required onBlur={handleBlur} value={ingresarPruebasEnsayos.tipoActividad} fullWidth label="Tipo de actividad" name="tipoActividad" onChange={handleChange}/>
            {error.tipoActividad && <p style={sytles}>{error.tipoActividad}</p>}
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
  
  export default CreatePruebasEnsayosForm;