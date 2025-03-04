import { Autocomplete, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import MuiAlert from '@mui/material/Alert';

import { useAuthReactivos } from "../../hooks/AuthContextReactivos";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
  color:"#dc3545",
}

const CreateInventariosForm = ({onAdd}) => {
  const [openAler, setOpenAlert] = useState(false);
  const [error,setError] = useState({});
  const [mostrarCampo, setMostrarCampo] = useState('');
  const { reactivos} = useAuthReactivos();

  const handleShowCampo = ()=>{setMostrarCampo(true);}

  const handleHideCampo = ()=>{setMostrarCampo(false);}

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  }; 
  
  const [ingresarInventarios, setInventarios] = useState({
    codigo:"",
    seccion:"",
    nombreReactivo:[],
    concentracion:"",
    cantidadReactivo: "",
    marca:"",
    capacidadRecipiente: "",
    tipoRecipiente:"",
    fechaVencimiento:"",
    fechaAdquisicion:"",
    etiquetaSGA:"",
    almacenamiento:"",
  });

  /*const submit =()=>{
    console.log(ingresarInventarios)
  }*/

  const handleChangeNomReactivo = ({target: {id, value}}, p=0) =>{ 
    if(id && id.includes("nombreReactivo-option-")){
      let newArray = [...ingresarInventarios.nombreReactivo]
      newArray.push(p)
      setInventarios({...ingresarInventarios, nombreReactivo: newArray.pop()}) 
    }
  };

  const handleChange = ({target: {name, value}}) =>{ 
    setInventarios({...ingresarInventarios,[name]:value})
  };

  const handleBlur = (e) =>{
    handleChange(e);
    setError(validate(ingresarInventarios));
  }
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError(validate(ingresarInventarios));
    if(Object.keys(error).length ===0){
      try{
        await onAdd(ingresarInventarios.codigo, ingresarInventarios.seccion,ingresarInventarios.nombreReactivo, ingresarInventarios.concentracion, ingresarInventarios.cantidadReactivo, ingresarInventarios.marca, ingresarInventarios.capacidadRecipiente, ingresarInventarios.tipoRecipiente, ingresarInventarios.fechaVencimiento, ingresarInventarios.fechaAdquisicion, ingresarInventarios.etiquetaSGA, ingresarInventarios.almacenamiento)
        setInventarios({
          codigo:"",
          seccion:"",
          nombreReactivo:[],
          concentracion:"",
          cantidadReactivo: "",
          marca:"",
          capacidadRecipiente: "",
          tipoRecipiente:"",
          fechaVencimiento:"",
          fechaAdquisicion:"",
          etiquetaSGA:"",
          almacenamiento:"",
         });
        setOpenAlert(true);
        console.log("se registro el inventario")
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
    if(!values.codigo){
      errors.codigo = "El campo numero es requerido"
    }if(!values.concentracion){
      errors.concentracion = "El campo concentración es requerido"
    }if(!values.marca){
      errors.marca = "El campo marca es requerido"
    }if(!values.tipoRecipiente){
      errors.tipoRecipiente = "El campo tipo de recipiente es requerido"
    }if(!values.fechaAdquisicion){
      errors.fechaAdquisicion = "El campo fecha de adquisicion es requerido"
    }if(!values.fechaVencimiento){
      errors.fechaVencimiento = "El campo fecha de vencimiento es requerido"
    }
    return errors;    
  };

  return (
    <Container>
      <Box sx={{ width: "100%" }}>
          <Grid container rowSpacing={1}  sx={{ my: 2 }} columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
            <Grid item xs={4}>
                <TextField required onBlur={handleBlur} value={ingresarInventarios.codigo} fullWidth label="Código" name="codigo" id="codigo" onChange={handleChange}/>
                {error.codigo && <p style={sytles}>{error.codigo}</p>}
            </Grid>
            <Grid item xs={8}>
                <TextField required onBlur={handleBlur} value={ingresarInventarios.seccion} fullWidth label="Sección" name="seccion" onChange={handleChange}/>
            </Grid>            
          </Grid>  
            <Grid item xs={12} md={12} sx={{ my: 2 }}>
              <Typography variant="subtitle" sx={{fontWeight:"bold"}}>Identificación del compuesto quimico</Typography>
            </Grid>
            <Grid container rowSpacing={1} sx={{ my: 2 }}  columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
              <Grid item xs={6} >
                <Autocomplete
                  id="nombreReactivo"
                  fullWidth
                  onChange={handleChangeNomReactivo}
                  options={reactivos}
                  getOptionLabel={(option) => option.Nombre }
                  filterSelectedOptions
                  renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nombre del reactivo"
                  />                            
                  )}
                />     
              </Grid>
              <Grid item xs={3} >
                <TextField required onBlur={handleBlur} value={ingresarInventarios.concentracion} fullWidth label="Concentración" name="concentracion" onChange={handleChange}/>
                {error.concentracion && <p style={sytles}>{error.concentracion}</p>}
              </Grid>
              <Grid item xs={3} >
                <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" value={ingresarInventarios.cantidadReactivo} fullWidth label="Cantidad" name="cantidadReactivo" onChange={handleChange}/>
              </Grid> 
              <Grid item xs={4} md={4}>
                <TextField required onBlur={handleBlur} value={ingresarInventarios.marca} fullWidth label="Marca" name="marca" onChange={handleChange}/>
                {error.marca && <p style={sytles}>{error.marca}</p>}
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" value={ingresarInventarios.capacidadRecipiente} fullWidth label="Capacidad del recipiente" name="capacidadRecipiente" onChange={handleChange}/>
                {error.capacidadRecipiente && <p style={sytles}>{error.capacidadRecipiente}</p>}
              </Grid>
              <Grid item xs={4} md={4}>
                <FormControl fullWidth required onBlur={handleBlur} >
                  <InputLabel id="select-label" >Tipo de recipiente</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="tipoRecipiente"
                    label="Tipo de recipiente"
                    name="tipoRecipiente"
                    value={ingresarInventarios.tipoRecipiente}
                    onChange={handleChange}>
                          <MenuItem onClick={handleHideCampo} value={"Plastico"}>Plástico</MenuItem>
                          <MenuItem onClick={handleHideCampo} value={"Vidrio transparente"}>Vidrio Transparente</MenuItem>
                          <MenuItem onClick={handleHideCampo} value={"Vidrio ambar"}>Vidrio ambar</MenuItem>
                          <MenuItem onClick={handleShowCampo} value={"Otro"}>Otro</MenuItem>
                  </Select>
                </FormControl>   
                {error.tipoRecipiente && <p style={sytles}>{error.tipoRecipiente}</p>}           
              </Grid>
              {mostrarCampo && <Grid item xs={4}>
                <TextField id="tipoRecipiente" placeholder="Ingrese el nombre" label="Tipo de recipiente" variant="outlined" />
              </Grid>}
              <Grid item xs={5}> 
                <TextField label="Fecha de vencimiento (DD/MM/AAAA)" required onBlur={handleBlur} value={ingresarInventarios.fechaVencimiento} placeholder="DD/MM/AAAA"  fullWidth name="fechaVencimiento"  onChange={handleChange}/>
                {error.fechaVencimiento && <p style={sytles}>{error.fechaVencimiento}</p>}
              </Grid>  
            </Grid>
            <Grid item xs={12} md={12} sx={{ my: 2 }}>
              <Typography variant="subtitle" sx={{fontWeight:"bold"}}>Laboratorio</Typography>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
            <Grid item xs={5}>
              <TextField label="Fecha de adquisición (DD/MM/AAAA)" required onBlur={handleBlur} value={ingresarInventarios.fechaAdquisicion} placeholder="DD/MM/AAAA" fullWidth name="fechaAdquisicion"  onChange={handleChange}/>
              {error.fechaAdquisicion && <p style={sytles}>{error.fechaAdquisicion}</p>}
            </Grid>  
            <Grid item xs={3} >
              <FormControl fullWidth required onBlur={handleBlur} >
                  <InputLabel id="select-label">Etiqueta SGA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="etiquetaSGA"
                    label="Etiqueta SGA"
                    name="etiquetaSGA"
                    value={ingresarInventarios.etiquetaSGA}
                    onChange={handleChange}>
                          <MenuItem value={"Si"}>Si</MenuItem>
                          <MenuItem value={"No"}>No</MenuItem>
                  </Select>
                </FormControl>  
            </Grid>
            <Grid item xs={4} md={4}>
                <TextField required onBlur={handleBlur} value={ingresarInventarios.almacenamiento} fullWidth label="Almacenamiento" name="almacenamiento" onChange={handleChange}/>
            </Grid>  
            <Grid item xs={8} sx={{textAlign:"right" }}>
              <Button type="submit" onClick={handleSubmit} variant="contained"  sx={{width:"40%", bgcolor: "#FF0000", color: "white",
                "&:hover": { bgcolor: "#9d0000" },}}>Registrar</Button>
            </Grid>
          </Grid>
          <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              Inventario Registrado Correctamente!
            </Alert>
          </Snackbar>
        </Box>
    </Container>

  );

};

export default CreateInventariosForm;