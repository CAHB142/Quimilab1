import {
    Button,
    Grid,
    TextField,
    Container,
    Autocomplete,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    
  } from "@mui/material";
  import React, { useState } from "react";
  import Snackbar from '@mui/material/Snackbar';
  import MuiAlert from '@mui/material/Alert';
  import { useAuthReactivos } from "../../hooks/AuthContextReactivos";

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  const sytles ={
    color:"#dc3545",
  }
  
  const EditarFormulario = ({edit, params, updateData}) => {

    const [openAler, setOpenAlert] = useState(false);
    const [mostrarCampo, setMostrarCampo] = useState('');
    const { reactivos} = useAuthReactivos();
    const {id} = params
    const [error,setError] = useState({});
    const [newInventario, setNewInventario] = useState(params);

    const handleShowCampo = ()=>{setMostrarCampo(true)}
    const handleHideCampo = ()=>{setMostrarCampo(false);}
    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlert(false);
    }; 

    const handleChange = ({target: {name, value}}) =>{ 
        setNewInventario({...newInventario,[name]:value})
    };

    const handleAutocompleteChange = (event, newValue) => {
      setNewInventario((prevInventario) => ({
        ...prevInventario,
        nombreReactivo: newValue,
      }));
    }

    const handleBlur = (e) =>{
      handleChange(e);
      setError(validate(newInventario));
    }
    
    const handleClickEdit = async(inventariosid) => {
        setError(validate(newInventario));
        if(Object.keys(error).length ===0){
          await updateData(inventariosid, newInventario.codigo, newInventario.seccion, newInventario.nombreReactivo, newInventario.concentracion,newInventario.cantidadReactivo, newInventario.marca,newInventario.capacidadRecipiente,newInventario.tipoRecipiente,newInventario.fechaVencimiento,newInventario.fechaAdquisicion,newInventario.etiquetaSGA, newInventario.almacenamiento)
        }
        setOpenAlert(true);
    };

    

    const validate= (values)=> {
      const errors = {}

      if(!values.codigo){
        errors.codigo = "El campo es requerido"
      }if(!values.nombreReactivo){
        errors.nombreReactivo = "El campo es requerido"
      }if(!values.concentracion){
        errors.concentracion = "El campo es requerido"
      }if(!values.marca){
        errors.marca = "El campo es requerido"
      }if(!values.tipoRecipiente){
        errors.tipoRecipiente = "El campo es requerido"
      }if(!values.fechaAdquisicion){
        errors.fechaAdquisicion = "El campo es requerido"
      }if(!values.fechaVencimiento){
        errors.fechaVencimiento = "El campo es requerido"
      }
      return errors;    
    };

    return (
        <Container >
            <Grid container sx={{ p: 1 }} spacing={1}>    
              <Box sx={{ width: "100%" }}>
                <Grid container rowSpacing={1}  sx={{ my: 2 }}columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
                  <Grid item xs={4}>
                      <TextField required onBlur={handleBlur} defaultValue={params.codigo} fullWidth label="Código" name="codigo" id="codigo" onChange={handleChange}/>
                      {error.codigo && <p style={sytles}>{error.codigo}</p>}
                  </Grid>
                  <Grid item xs={8}>
                      <TextField required onBlur={handleBlur} defaultValue={params.seccion} fullWidth label="Sección" name="seccion" onChange={handleChange}/>
                  </Grid>            
                </Grid>  
                <Grid item spacing={2} xs={12} md={12} sx={{ my: 2 }}>
                  <Typography variant="subtitle" sx={{fontWeight:"bold"}}>Identificación del compuesto quimico</Typography>
                </Grid>
                <Grid container rowSpacing={1} sx={{ my: 2 }}  columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="nombreReactivo"
                      fullWidth
                      defaultValue={params.nombreReactivo}
                      onChange={handleAutocompleteChange}
                      options={reactivos}
                      getOptionLabel={(option) => option.Nombre}
                      filterSelectedOptions
                      renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre del reactivo"
                      />)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField required onBlur={handleBlur} defaultValue={params.concentracion} fullWidth label="Concentración" name="concentracion" onChange={handleChange}/>
                    {error.concentracion && <p style={sytles}>{error.concentracion}</p>}
                  </Grid> 
                  <Grid item xs={3} >
                    <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" defaultValue={params.cantidadReactivo} fullWidth label="Cantidad" name="cantidadReactivo" onChange={handleChange}/>
                    {error.cantidadReactivo && <p style={sytles}>{error.cantidadReactivo}</p>}
                  </Grid>   
                  <Grid item xs={4} >
                    <TextField required onBlur={handleBlur} defaultValue={params.marca}fullWidth label="Marca" name="marca" onChange={handleChange}/>
                    {error.marca && <p style={sytles}>{error.marca}</p>}
                  </Grid>                       
                  <Grid item xs={4} >
                    <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" defaultValue={params.capacidadRecipiente} fullWidth label="Capacidad del recipiente" name="capacidadRecipiente" onChange={handleChange}/>
                    {error.capacidadRecipiente && <p style={sytles}>{error.capacidadRecipiente}</p>}
                  </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth required onBlur={handleBlur} >
                    <InputLabel id="select-label" >Tipo de recipiente</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="tipoRecipiente"
                      label="Tipo de recipiente"
                      name="tipoRecipiente"
                      defaultValue={params.tipoRecipiente}
                      onChange={handleChange}>
                            <MenuItem onClick={handleHideCampo} value={"Plastico"}>Plástico</MenuItem>
                            <MenuItem onClick={handleHideCampo} value={"Vidrio transparente"}>Vidrio Transparente</MenuItem>
                            <MenuItem onClick={handleHideCampo} value={"Vidrio ambar"}>Vidrio ambar</MenuItem>
                            <MenuItem onClick={handleShowCampo} value={"Otro"}>Otro ¿Cuál?</MenuItem>
                    </Select>
                  </FormControl>   
                  {error.tipoRecipiente && <p style={sytles}>{error.tipoRecipiente}</p>}           
                </Grid>
                {mostrarCampo && <Grid item xs={4}>
                  <TextField id="outlined-basic" placeholder="Ingrese el nombre" label="Tipo de recipiente" variant="outlined" />
                </Grid>}
                <Grid item xs={4}> 
                  <TextField label="Fecha de vencimiento" required onBlur={handleBlur} defaultValue={params.fechaVencimiento} placeholder="DD/MM/AAAA"  fullWidth name="fechaVencimiento"  onChange={handleChange}/>
                  {error.fechaVencimiento && <p style={sytles}>{error.fechaVencimiento}</p>}
                </Grid>  
              </Grid>
              <Grid item xs={12} md={12} sx={{ my: 2 }}>
                <Typography variant="subtitle" sx={{fontWeight:"bold"}}>Laboratorio</Typography>
              </Grid>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
              <Grid item xs={4}>
                <TextField label="Fecha de adquisición" required onBlur={handleBlur} defaultValue={params.fechaAdquisicion} placeholder="DD/MM/AAAA" fullWidth name="fechaAdquisicion"  onChange={handleChange}/>
                {error.fechaAdquisicion && <p style={sytles}>{error.fechaAdquisicion}</p>}
              </Grid>  
              <Grid item xs={4}>
                <FormControl fullWidth required onBlur={handleBlur} >
                    <InputLabel id="select-label">Etiqueta SGA</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="etiquetaSGA"
                      label="Etiqueta SGA"
                      name="etiquetaSGA"
                      defaultValue={params.etiquetaSGA}
                      onChange={handleChange}>
                            <MenuItem value={"Si"}>Si</MenuItem>
                            <MenuItem value={"No"}>No</MenuItem>
                    </Select>
                  </FormControl>  
              </Grid>
              <Grid item xs={4} >
                  <TextField required onBlur={handleBlur} defaultValue={params.almacenamiento} fullWidth label="Almacenamiento" name="almacenamiento" onChange={handleChange}/>
              </Grid>  
              <Grid item xs={8} sx={{textAlign:"right" }}>
                <Button onClick={()=> handleClickEdit(id)} type="submit" fullWidth variant="contained" sx={{width:"50%", mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Editar</Button>
              </Grid>
            </Grid>
          </Box>
          <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              Inventario Editado Correctamente!
            </Alert>
          </Snackbar>         
        </Grid>
      </Container>
      
    );
  };
  
  export default EditarFormulario;