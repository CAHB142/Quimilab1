
import { forwardRef,useState} from "react";
import { useAuth } from "../context/AuthContext";
import { Box, Button, TextField, Grid, Select, MenuItem, InputLabel, FormControl, Dialog, IconButton, DialogContent, DialogTitle} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

const sytles ={
    color:"#dc3545",
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export function Registro(){
    const [openAler, setOpenAlert] = useState(false);
    const [error,setError] = useState({});
    const {signup} = useAuth()
    const [open] = useState(true);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlert(false);
    };

    const [user, setUser] = useState({
        Nombre: "",
        Apellidos:"",
        tipoDocumento:"",
        NumDocumento:"",
        Telefono:"",
        email:"",
        cargo:"",
        password:"",
        password2:"",
        Rol:"Invitado",
    });

    const handleChange = ({target: {name, value}}) =>{ 
      setUser({...user,[name]:value})  
    };

    const handleBlur = (e) =>{
      handleChange(e);
      setError(validate(user));
    }
        
    const handleSubmit = async event =>{
        event.preventDefault();
        setError(validate(user));
        if(Object.keys(error).length ===0){
            try{
                await signup(user.email, user.password, user.Nombre, user.Apellidos, user.tipoDocumento,user.NumDocumento, user.Telefono, user.cargo, user.Rol)
                setOpenAlert(true);
                setUser({
                    Nombre: "",
                    Apellidos:"",
                    tipoDocumento:"",
                    NumDocumento:"",
                    Telefono:"",
                    email:"",
                    cargo:"",
                    password:"",
                    password2:"",
                  });
            }catch(error){
                setError({
                    error: true,
                    text:"Problemas con el registro",
                  });               
            }
        } 
        return;            
    }

    const validate= (values)=> {
        const errors = {}
        const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        const regexEmail = /^[A-Z0-9._%+-]+@[correounivalle]+\.[edu]+\.[co]/i;
        
        if(!values.Nombre){
          errors.Nombre = "El campo nombre es requerido"
        }else if(!regexName.test(values.Nombre)){
          errors.Nombre = "El campo nombre sólo acepta letras y espacios en blanco"
        }if(!values.Apellidos){
          errors.Apellidos = "El campo apellido es requerido"
        }else if(!regexName.test(values.Apellidos)){
          errors.Apellidos = "El campo apellido sólo acepta letras y espacios en blanco"
        }if(!values.NumDocumento){
          errors.NumDocumento = "El campo documento es requerido"
        }if(!values.tipoDocumento){
          errors.tipoDocumento = "El campo tipo documento es requerido"
        }if(!values.Telefono){
          errors.Telefono = "El campo teléfono es requerido"
        }else if(values.Telefono.length < 7){
          errors.Telefono = "El campo teléfono debe tener más de 7 dígitos"
        }else if(values.Telefono.length > 10){
          errors.Telefono = "El campo teléfono no puede tener más de 10 digitos"
        }if(!values.email){
          errors.email = "El campo email es requerido"
        }else if(!regexEmail.test(values.email)){
          errors.email = "El campo email solo acepta correo institucional"
        }if(!values.cargo){
          errors.cargo = "El campo cargo es requerido"
        }if(!values.password){
          errors.password = "El campo contraseña es requerido"
        }if(!values.password2){
          errors.password2 = "El campo confirme contraseña es requerido"
        }
        return errors;   
      };
  
    return (
        <>

        <Dialog open={open}  fullWidth={true}  maxWidth='xs'>
        <Box>
          <IconButton href="/" >
            <CloseIcon />
          </IconButton>
        </Box> 
        <DialogTitle sx={{ textAlign: "center" }}>
          Solicitud de registro
        </DialogTitle>
        <DialogContent>
        <Grid container sx={{ p: 0}} spacing={1}>
            <Grid item xs={12}>
            <TextField onBlur={handleBlur} required value={ user.Nombre} fullWidth label="Nombre" name="Nombre" error={error.error} helperText={error.text} onChange={handleChange}/>
            {error.Nombre && <p style={sytles}>{error.Nombre}</p>}
            </Grid>
            <Grid item xs={12}>
            <TextField onBlur={handleBlur} required value={user.Apellidos} error={error.error} helperText={error.text} fullWidth label="Apellidos" name="Apellidos" onChange={handleChange}/>
            {error.Apellidos && <p style={sytles}>{error.Apellidos}</p>}
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth required onBlur={handleBlur}>
                    <InputLabel error={error.error} helperText={error.text} id="select-label" >Tipo de Documento</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="tipoDocumento"
                        label="Tipo de Documento"
                        name="tipoDocumento"
                        value={user.tipoDocumento}
                        onChange={handleChange}
                    >
                        <MenuItem value={"Cedula"}>Cedula de Ciudadania</MenuItem>
                        <MenuItem value={"Pasaporte"}>Pasaporte</MenuItem>
                        <MenuItem value={"Carnet"}>Carnet</MenuItem>
                    </Select>
                </FormControl>
                {error.tipoDocumento && <p style={sytles}>{error.tipoDocumento}</p>}        
            </Grid>
            <Grid item xs={12}>
            <TextField type="number" onBlur={handleBlur} required value={user.NumDocumento} error={error.error} helperText={error.text} fullWidth label="Documento" name="NumDocumento" onChange={handleChange}/>
            {error.NumDocumento && <p style={sytles}>{error.NumDocumento}</p>}               
            </Grid>
            <Grid item xs={12}>
            <TextField type="number" onBlur={handleBlur} required value={user.Telefono} error={error.error} helperText={error.text} fullWidth label="Teléfono" name="Telefono" onChange={handleChange}/>
            {error.Telefono && <p style={sytles}>{error.Telefono}</p>}                
            </Grid>
            <Grid item xs={12}>
            <TextField onBlur={handleBlur}  required value={user.email} error={error.error} helperText={error.text} fullWidth label="Correo institucional" name="email" onChange={handleChange}/>
            {error.email && <p style={sytles}>{error.email}</p>}        
            </Grid>    
            <Grid item xs={12}>
            <FormControl fullWidth required onBlur={handleBlur} >
                <InputLabel id="select-label">Cargo</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="cargo"
                    label="Cargo"
                    name="cargo"
                    value={user.cargo}
                    onChange={handleChange}
                    >
                        <MenuItem value={"Laboratorista"}>Laboratorista</MenuItem>
                        <MenuItem value={"Profesor"}>Profesor</MenuItem>
                        <MenuItem value={"Estudiante"}>Estudiante</MenuItem>
                        <MenuItem value={"Practicante"}>Practicante</MenuItem>
                        <MenuItem value={"Servicios"}>Servicios Varios</MenuItem>
                </Select>
            </FormControl>
            {error.cargo && <p style={sytles}>{error.cargo}</p>}        
            </Grid>
            <Grid item xs={12}>
            <TextField onBlur={handleBlur} value={user.password} required fullWidth id="password" label="Contraseña" name="password" 
                autoComplete="password" type="password" autoFocus  error={error.error} helperText={error.text}  onChange={handleChange} />
                {error.password && <p style={sytles}>{error.password}</p>}                
            </Grid>
            <Grid item xs={12}>
            <TextField onBlur={handleBlur} value={user.password2} required fullWidth id="password2" label="Confirme la contraseña" name="password2" 
                autoComplete="password" type="password" autoFocus error={error.error} helperText={error.text} onChange={handleChange} />
                {error.password2 && <p style={sytles}>{error.password2}</p>}                
            </Grid>
            <Grid item xs={12} sx={{textAlign:"center" }}>
            <Button onClick={handleSubmit} variant="contained"  sx={{width:"100%", bgcolor: "#FF0000", color: "white",
                "&:hover": { bgcolor: "#9d0000" },}}>Enviar registro</Button>
            </Grid>
            <Grid item xs={12} sx={{textAlign:"center" }}>
            <Button href="/" variant="contained"  sx={{width:"100%", bgcolor: "#FF0000", color: "white",
                "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
            </Grid>
        </Grid>
        </DialogContent>
        </Dialog>
      <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Usuario Registrado Correctamente!
        </Alert>
      </Snackbar>
    
        </>
    )
}

 