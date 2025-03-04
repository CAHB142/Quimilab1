import * as React from 'react';
import {forwardRef, useState} from "react";
import Perfil from "../assets/img/miperfil.png";
import { useAuth } from "../context/AuthContext";
import CloseIcon from '@mui/icons-material/Close';
import {IconButton,Grid, TextField, Modal, Button, Typography, Box, Card, Avatar, Badge, CardContent, Divider } from "@mui/material"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

const styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 400,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid error.main',
    borderRadius: '2%',
    boxShadow: 24,
    p: 4,
};

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 4px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 2.0s infinite ease-in-out',
        border: '3px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.0)',
        opacity: 0,
      },
    },
  }));

export function PerfilUsuario(){

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {usere, updatePasswordc, reauthenticateWithCredentiaL} = useAuth();
    const [openAler, setOpenAlert] = useState(false);

    const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
          return;
        }
        setOpenAlert(false);
    };

    const [error,setError] = useState({
        error: false,
        text:"",
        
    });

    const [errorContraActu,setErrorContraActu] = useState({
        error: false,
        text:"",
        
    });

    const [user, setUser] = useState({
        contrasena:"",
        contrasena1:"",
        contrasenaOld:"",
    });

    const handleChange = ({target: {name, value}}) =>{ 
        setUser({...user,[name]:value})
    };

    const handleSubmit=  async(event) =>{
        event.preventDefault();
        const reauthenticateWith = await reauthenticateWithCredentiaL(user.contrasenaOld);
        if(!reauthenticateWith.statusResponse){
            setErrorContraActu({
                error: true,
                text: "Contraseña incorrecta",
            }); 
            return;
        }

        if (user.contrasena !== user.contrasena1) {
            setError({
                error: true,
                text: "Las contraseñas no son iguales",
            });
            return;
        }

        try{  
            await updatePasswordc (user.contrasena1)
            setOpenAlert(true);
            setOpen(false);
        }catch(error){
            if (error.code === "auth/weak-password"){
                setError({
                    error: true,
                    text:"La contraseña debe tener mas de 6 caracteres",
                });
            } 
        }
        
    }    
    
    return (
        <>
        <Card elevation={5}>
                <Grid item xs={12} sx={{textAlign: "center"}}>
                    <Typography variant="h4" component="div">
                        Mi perfil
                    </Typography>
                </Grid>
                <CardContent>                
                    <Grid container sx={{textAlign: "center", alignItems: 'center'}}>                   
                        <Grid item xs={12}>
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >        
                                <Avatar src={Perfil} sx={{ width: 150, height: 150 }}/>
                            </StyledBadge>
                        </Grid>
                        <Grid item xs={12} >
                        <Box
                        sx={{
                            width: 160,
                            mt: 1,
                            height: 30,
                            backgroundColor: '#78909c                            ',
                            top: '50%', left: '42%' ,position: 'relative', border: '1px solid error.main', borderRadius: '3%'  
                        }}
                        >
                                <Typography variant="h6" color="white">
                                    {usere.rol} 
                                </Typography>
                                </Box>
                        </Grid>
                        <Divider textAlign="center" sx={{ width: "100%", mt: 2, bgcolor: "#bdbdbd"}}/>
                        <Grid container spacing={0.5} >
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="h6">
                                    Nombre completo:
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={6} textAlign="left">
                                <Typography variant="h6" >
                                 {usere.nombre + " " +usere.apellidos} 
                                </Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right" >
                                <Typography variant="h6">
                                Correo electrónico: 
                                </Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="left">
                                <Typography variant="h6"  >
                                {usere.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="h6">
                                Teléfono: 
                                </Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="left">
                                <Typography variant="h6" >
                                {usere.telefono}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="h6">
                                Cargo: 
                                </Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="left">
                                <Typography variant="h6" >
                                {usere.cargo}
                                </Typography>
                            </Grid>
                        </Grid>
                        </Grid>
                        <Button color="inherit" onClick={handleOpen} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                                "&:hover": { bgcolor: "#9d0000" },  width: 300, top: '50%', left: '36%'}} >
                                Cambiar contraseña
                            </Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                                <Box sx={styles}>
                                    <IconButton onClick={handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                        Cambiar Contraseña
                                    </Typography>
                                    <TextField margin="normal" required fullWidth id="contrasenaOld" label="Contraseña actual" name="contrasenaOld" type="password" 
                                    autoFocus onChange={handleChange} error={errorContraActu.error} helperText={errorContraActu.text}/>
                                    <TextField margin="normal" required fullWidth id="contrasena" label="Nueva contraseña" name="contrasena1" type="password" 
                                    autoFocus onChange={handleChange} error={error.error} helperText={error.text}/>
                                    <TextField margin="normal" required fullWidth id="contrasena2" label="Confirme la contraseña" name="contrasena" type="password" 
                                    autoFocus onChange={handleChange} error={error.error} helperText={error.text}/>
                                    <Button onClick={handleSubmit} type="submit" color="inherit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                                        "&:hover": { bgcolor: "#9d0000" },}} >Guardar</Button>
                                </Box>
                        </Modal>
                    </CardContent>
                           
        </Card> 
        <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            Cambio de contraseña exitoso!
            </Alert>
        </Snackbar>

              
        </>
    );
}


export default function Dashboard() {
    return <PerfilUsuario/>;
}
