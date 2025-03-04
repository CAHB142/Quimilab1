import * as React from 'react';
import {forwardRef, useState} from "react";
import { useAuth } from "../context/AuthContext";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export function RecuperarCon(){
    const { resetPassword} = useAuth();
    const [user, setUser] = useState({
      email:"",
    });
    const [openAler, setOpenAlert] = useState(false);
    const [open] = React.useState(true);

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

    const handleChange = ({target: {name, value}}) =>{ 
        setUser({...user,[name]:value})
    };   
    const handleSubmit = async event =>{
        event.preventDefault();
        if(!user.email) return console.log('no existe el email') 
        try{  
            await resetPassword (user.email)
            setOpenAlert(true);
            setTimeout(() => {
                window.location.href = "/";
            }, 5000);
        }catch(error){ 
            console.log({error})
            if(error.code === "auth/user-not-found"){
                setError({
                    error: true,
                    text:"Correo no Registrado",
                });
            }  
        }
        
    }
  
    return ( 
        <>      
            <Grid container sx={{ p: 1 }} spacing={1}>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Recupera tu contraseña</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor ingresa tu correo y pronto recibirá un mensaje con un link a la nueva contraseña.
                    </DialogContentText>
                    <TextField margin="normal" required fullWidth id="email" label="Correo electrónico" name="email"  
                        autoFocus onChange={handleChange} error={error.error} helperText={error.text}/>
                </DialogContent>
                <DialogActions>
                    <div>
                    <Button href="/" type="submit"  variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>
                        Cerrar
                    </Button>
                    </div>
                    <div>
                        <Button onClick={handleSubmit} type="submit" variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>Restablecer Contraseña</Button>
                    </div>
                </DialogActions>
            </Dialog>
            </Grid>
            <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                    Se envio un link a su email!
                </Alert>
            </Snackbar>
        </>
    )
}