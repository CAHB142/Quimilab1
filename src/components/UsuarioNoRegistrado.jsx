import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Grid } from "@mui/material";
import { useAuth } from '../context/AuthContext';
import logo from "../assets/img/logoGoogle.png"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));


function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CustomizedDialogs() {
  const [open] = React.useState(true);
  const {logout} = useAuth();

  const handleLogout = async() =>{
    await logout()
  };

  return (
    <div>

      <BootstrapDialog
        onClose={handleLogout}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleLogout}
        >
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar alt="Remy Sharp" src={logo} sx={{ width: 30, height: 30 }} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant="h8" > Inicio sesión con google</Typography>
            </Grid>
          </Grid>
          
        </BootstrapDialogTitle>
        <DialogContent >
          <Typography variant="h6" gutterBottom>
            No puedes ingresar a Quimilab
          </Typography>
          <Typography gutterBottom>
            Por favor ingresar con un correo institucional
          </Typography>
          
        </DialogContent>
        <DialogActions>
          <Button sx={{ bgcolor: "#FF0000", color: "white", width: '80%', right: '10%',
                "&:hover": { bgcolor: "#9d0000" },}} autoFocus onClick={handleLogout}>
            Continuar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
