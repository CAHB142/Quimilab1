import React, { useState } from "react";
import MuiAlert from '@mui/material/Alert';
import { useAuthReactivos } from "../../hooks/AuthContextReactivos";
import {useAuthLaboratorio} from "../../hooks/AuthContextLaboratorios"
import { Autocomplete, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
    color:"#dc3545",
}

const CreateForm = ({onAdd}) =>{

    const [openAlerCreate, setOpenAlertCreate] = useState(false);
    const [error,setError] = useState({});
    const { reactivos} = useAuthReactivos();
    const { laboratorios } =useAuthLaboratorio();

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertCreate(false);
    }; 

    const [ingresarDonacion, setDonaciones] = useState({
        fechaRegistro:"",
        nomReactivo:[],
        cantidad:"",
        responsable:"",
        telefono:"",
        lugar:[],
        estado:""            
    });

    const handleChangeNomReactivo = ({target: {id, value}}, p=0) =>{ 
        if(id && id.includes("nomReactivo-option-")){
          let newArray = [...ingresarDonacion.nomReactivo]
          newArray.push(p)
          setDonaciones({...ingresarDonacion, nomReactivo: newArray.pop()}) 
        }
    };

    const handleChangeLugar = ({target: {id, value}}, p=0) =>{ 
        if(id && id.includes("lugar-option-")){
          let newArray = [...ingresarDonacion.lugar]
          newArray.push(p)
          setDonaciones({...ingresarDonacion, lugar: newArray.pop()}) 
        }
    };

    const handleChange = ({target: {name, value}}) =>{ 
        setDonaciones({...ingresarDonacion,[name]:value})
    };

    const handleBlur = (e) =>{
        handleChange(e);
        setError(validate(ingresarDonacion));
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError(validate(ingresarDonacion));
        if(Object.keys(error).length ===0){
          try{
            await onAdd(ingresarDonacion.fechaRegistro, ingresarDonacion.nomReactivo,ingresarDonacion.cantidad, ingresarDonacion.responsable, ingresarDonacion.telefono, ingresarDonacion.lugar, ingresarDonacion.estado)
            setDonaciones({
                fechaRegistro:"",
                nomReactivo:[],
                cantidad:"",
                responsable:"",
                telefono:"",
                lugar: [],
                estado:""            
            });
            setOpenAlertCreate(true);
            console.log("se registro la donación")
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

    return (
        <Container>
            <Box sx={{ width: "100%" }}>
                <Grid container sx={{ p: 1 }} spacing={1}>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} value={ingresarDonacion.fechaRegistro} fullWidth type="date" name="fechaRegistro" id="fechaRegistro" onChange={handleChange}/>
                        {error.fechaRegistro && <p style={sytles}>{error.fechaRegistro}</p>}
                    </Grid>
                    <Grid item xs={12} >
                        <Autocomplete
                        id="nomReactivo"
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
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} placeholder="Unidad Kg/L" value={ingresarDonacion.cantidad} fullWidth label="Cantidad" name="cantidad" onChange={handleChange}/>
                        {error.cantidad && <p style={sytles}>{error.cantidad}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField required onBlur={handleBlur} value={ingresarDonacion.responsable} fullWidth label="Responsable" name="responsable" onChange={handleChange}/>
                        {error.responsable && <p style={sytles}>{error.responsable}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type="number" required onBlur={handleBlur} value={ingresarDonacion.telefono} fullWidth label="Teléfono" name="telefono" onChange={handleChange}/>
                        {error.telefono && <p style={sytles}>{error.telefono}</p>}
                    </Grid>
                    <Grid item xs={12}>
                        {/*<TextField required onBlur={handleBlur} value={ingresarDonacion.lugar} fullWidth label="Ubicación" name="lugar" onChange={handleChange}/>
                        {error.lugar && <p style={sytles}>{error.lugar}</p>}*/}
                        <Autocomplete
                        id="lugar"
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
                    <Grid item xs={12} >
                    <FormControl fullWidth required onBlur={handleBlur} >
                        <InputLabel id="select-label">Estado</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="estado"
                            label="Estado"
                            name="estado"
                            value={ingresarDonacion.estado}
                            onChange={handleChange}>
                                <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
                        </Select>
                        </FormControl>  
                    </Grid>

                    <Grid item xs={12} sx={{textAlign:"center" }}>
                        <Button type="submit" onClick={handleSubmit} variant="contained"  sx={{width:"100%", bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>Registrar</Button>
                    </Grid>
                   
                </Grid>
                <Snackbar open={openAlerCreate} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                    <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Donación Registrada Correctamente!
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    )
}

export default CreateForm;