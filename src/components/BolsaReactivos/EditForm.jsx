import {
    Button,
    Grid,
    TextField,
    Container,
    Autocomplete,
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
import {useAuthLaboratorio} from "../../hooks/AuthContextLaboratorios"

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
    color:"#dc3545",
}

const EditForm =({edit, params, updateData})=>{

    const [openAlerEdit, setOpenAlertEdit] = useState(false);
    const { reactivos} = useAuthReactivos();
    const {laboratorios} = useAuthLaboratorio()
    const {id} = params
    const [error,setError] = useState({});

    const [newDonacion, setNewDonacion] = useState(params);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertEdit(false);
    }; 
  
    const handleChange = ({target: {name, value}}) =>{ 
        setNewDonacion({...newDonacion,[name]:value})
    };

    const handleAutocompleteChange = (event, newValue) => {
        setNewDonacion(({
          ...newDonacion,
          nomReactivo: newValue,
        }));
    }

    const handleChangeAutocompleteLab = (event, newValue) => {
        setNewDonacion(({
          ...newDonacion,
          lugar: newValue,
        }));
    }

    const handleBlur = (e) =>{
        handleChange(e);
        setError(validate(newDonacion));
    }

    const handleClickEdit = async(inventariosid) => {
        setError(validate(newDonacion));
        if(Object.keys(error).length ===0){
          await updateData(inventariosid, newDonacion.fechaRegistro, newDonacion.nomReactivo, newDonacion.cantidad, newDonacion.responsable,newDonacion.telefono, newDonacion.lugar,newDonacion.estado)
          console.log("se edito")
        }
        setOpenAlertEdit(true);
    };

    const validate= (values)=> {
        const errors = {}
        if(!values.fechaRegistro){
          errors.fechaRegistro = "Este campo es requerido"
        }if(!values.cantidad){
          errors.cantidad = "Este campo es requerido"
        }if(!values.responsable){
          errors.responsable = "Este campo es requerido"
        }if(!values.telefono){
          errors.telefono = "Este campo es requerido"
        }else if(values.telefono.length < 7){
            errors.telefono = "Este campo debe tener más de 7 dígitos"
        }else if(values.telefono.length > 10){
            errors.telefono = "Este campo no puede tener más de 10 digitos"
        }if(!values.estado){
            errors.estado = "Este campo es requerido"
        }
        return errors;    
    };

    return(
        <Container>
            <Box sx={{ width: "100%" }}>
                <Grid container sx={{ p: 1 }} spacing={1}>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} defaultValue={params.fechaRegistro} fullWidth type="date" name="fechaRegistro" id="fechaRegistro" onChange={handleChange}/>
                        {error.fechaRegistro && <p style={sytles}>{error.fechaRegistro}</p>}
                    </Grid>
                    <Grid item xs={12} >
                        <Autocomplete
                        id="nomReactivo"
                        fullWidth
                        defaultValue={params.nomReactivo}
                        onChange={handleAutocompleteChange}
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
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" defaultValue={params.cantidad} fullWidth label="Cantidad" name="cantidad" onChange={handleChange}/>
                        {error.cantidad && <p style={sytles}>{error.cantidad}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} defaultValue={params.responsable} fullWidth label="Responsable" name="responsable" onChange={handleChange}/>
                        {error.responsable && <p style={sytles}>{error.responsable}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type="number" required onBlur={handleBlur} defaultValue={params.telefono} fullWidth label="Teléfono" name="telefono" onChange={handleChange}/>
                        {error.telefono && <p style={sytles}>{error.telefono}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        {/*<TextField required onBlur={handleBlur} defaultValue={params.lugar} fullWidth label="Ubicación" name="lugar" onChange={handleChange}/>
                        {error.lugar && <p style={sytles}>{error.lugar}</p>}*/}
                        <Autocomplete
                            id="lugar"
                            fullWidth
                            defaultValue={params.lugar}
                            onChange={handleChangeAutocompleteLab}
                            options={laboratorios}
                            getOptionLabel={(option) => option.nombreLaboratorio }
                            filterSelectedOptions
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nombre del Laboratorio"
                            />                            
                            )}
                        /> 

                    </Grid>
                    <Grid item xs={12} >
                    <FormControl fullWidth required onBlur={handleBlur} >
                        <InputLabel id="select-label">Estado</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="estado"
                            label="Estado"
                            name="estado"
                            defaultValue={params.estado}
                            onChange={handleChange}>
                                <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
                        </Select>
                        </FormControl>  
                    </Grid>
                    <Grid item xs={12} sx={{textAlign:"right" }}>
                        <Button onClick={()=> handleClickEdit(id)} type="submit" fullWidth variant="contained" sx={{width:"100%", mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Editar</Button>
                    </Grid>          
                </Grid>
                <Snackbar open={openAlerEdit} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                    <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Donación Editada Correctamente!
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    )
}

export default EditForm;