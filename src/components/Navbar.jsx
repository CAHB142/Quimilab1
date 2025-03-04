import { forwardRef, useState} from "react";
import AppBar from '@mui/material/AppBar';
import { useAuth } from "../context/AuthContext";
import imgQuimilab from "../assets/img/quimilabimg.png"
import CloseIcon from '@mui/icons-material/Close';
import {Link, Grid, TextField, Modal, Button, Typography, Toolbar, Box, IconButton } from "@mui/material"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid error.main',
    borderRadius: '2%',
    boxShadow: 24,
    p: 4,
  };

  
const Navbar = () =>{

    const [open, setOpen] = useState(false);
    const [openAler, setOpenAlert] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false); 
    const {login, loginWithGoogle} = useAuth();

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlert(false);
    };
    
    const [user, setUser] = useState({
        email:"",
        password:"",
    });

    const [error,setError] = useState({
        error: false,
        text:"",
        
    });

    const handleChange = ({target: {name, value}}) =>{ 
        setUser({...user,[name]:value})
    };

    const validateEmail = (email)=> {
        const regexEmail = /^[A-Z0-9._%+-]+@[correounivalle]+\.[edu]+\.[co]/i;
        return regexEmail.test(email);
    };

    const handleSubmitGoogle =  async(event) =>{
         await loginWithGoogle()  
    }

    const handleSubmit =  async(event) =>{
        event.preventDefault();    
        if(validateEmail(user.email)){
            setError({
            error: false,
            text:"",
                
            });
            
            try{           
                await login (user.email, user.password)
                setOpenAlert(true);
            }catch(error){
                if(error.code === "auth/wrong-password"){
                    setError({
                        error: true,
                        text:"Contraseña Incorrecta",
                    });
                }
                if(error.code === "auth/missing-password"){
                    setError({
                        error: true,
                        text:"Por favor Ingresar la Contraseña",
                    });
                }
                if(error.code === "auth/user-not-found"){
                    setError({
                        error: true,
                        text:"Usuario no Registrado",
                    });
                }
                if (error.code === "auth/weak-password"){
                    setError({
                        error: true,
                        text:"La contraseña debe tener mas de 6 caracteres",
                    });
                }
  
            }
        } else  {
            setError({
                error: true,
                text:"Ingresar usuario y contraseña",
            });
        } 
             
    }

    return(
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{bgcolor: "#FF0000"}}>
                <Toolbar>
                    <img src = {imgQuimilab} alt="Imagen nv" className="img"/>   
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        QuimiLab
                    </Typography>
                    <Button color="inherit" onClick={handleOpen}>Iniciar Sesion</Button>
                    <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box sx={style}>
                            <IconButton    onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                            <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                Iniciar Sesión
                            </Typography>
                            
                            <TextField margin="normal" required fullWidth name="email" label="Correo Intitucional" type="email"
                            id="email"  error={error.error} helperText={error.text}  onChange={handleChange} 
                             />

                            <TextField margin="normal" required fullWidth id="password" label="Contraseña" name="password" 
                                autoComplete="password" type="password" autoFocus   error={error.error} helperText={error.text} onChange={handleChange} />

                            <Button onClick={handleSubmit} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                                 "&:hover": { bgcolor: "#9d0000" },}}>Ingresar</Button>
                            
                            <Button onClick={handleSubmitGoogle} id = "googlelogin" type="button" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000",color: "white",
                                "&:hover": { bgcolor: "#9d0000" },}}>Ingresar con Google </Button>
                                <Grid container>
                                    <Grid item xs>
                                    <Link href="/RecuperarCon" variant="body2" color="#FF0000">
                                        ¿Olvidó su Contraseña?
                                    </Link>
                                    </Grid>
                                    <Grid item>
                                    <Link href="/Registro" variant="body2" color="#FF0000">
                                        ¿No tiene cuenta? Registrarte
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Modal>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
        <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                Ingreso exitoso!
            </Alert>
        </Snackbar>
    </>
    )
   
}

export default Navbar;