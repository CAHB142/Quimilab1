/*USUARIO LIST MODIFICADO */

import React from "react";
import { forwardRef,useState } from "react";
import { useAuth } from "../../hooks/AuthContextUsuarios";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Grid,
  InputBase,
  Paper,
  DialogTitle,
  DialogContent,
  Menu,
  MenuItem,
  Box,
  Dialog,
  Tooltip,
  DialogContentText,
  DialogActions,
  Container
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateUsuariosForm from "./CreateUsuariosForm";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditeUserForm from "./EditeUserForm";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UsuariosList = () => {

  const [guardarLaboratorio, setGuardarLaboratorio] = useState()
  const {usuarioRegistrados, deleteData, registro, updateData} = useAuth();
  //const [openAler, setOpenAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(""); 
  const [openEdit, setOpenEdit] = useState(false);
  const [openAlertDelete, setOpenAlertDelete] = useState(false);

  const handleCloseAlertDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlertDelete(false);
  }; 
  const handleOpenEdit= () => setOpenEdit(true)
  const handleCloseEdit = () => setOpenEdit(false);

  const handleChange =(evento) =>{
    setSearch(evento.target.value)
  }

  /*const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  }; */
  
  const openDialogCreate = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    { field: "nombreUsuario", headerName: "Nombre", width: 160, editable: false },
    { field: "apellidoUsuario", headerName: "Apellido", width: 150, editable: false },
    { field: "tipoDocumento", headerName: "Tipo Documento", width: 150, editable: false },
    { field: "documentoUsurio", headerName: "Documento", width: 150, editable: false },
    { field: "telefonoUsuario", headerName: "Télefono", width: 150, editable: false },
    { field: "correoUsurio", headerName: "Correo electrónico", width: 300, editable: false },
    { field: "cargoUsurio", headerName: "Cargo", width: 150, editable: false },
    { field: "rolUsuario", headerName: "Rol", width: 150, editable: false },
    { field: "labAsig", headerName: "Laboratorios asignados", width: 400, editable: false },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData} updateData={updateData} />,
    },
  ];

  const rolM = (index) =>{
      let string = '';
      index.asigLaboratorios?.forEach(element => {
        string += element.nombreLaboratorio + ", "
      });
      string = string.slice(0, string.lastIndexOf(","));
      return string;
    /*else{
      let noaplica =""
      index.asigLaboratorios.forEach((elem) =>
        noaplica += elem.nombreLaboratorio === "No aplica "
      )
      return noaplica;
    } */   
  }
  
  const rows =  usuarioRegistrados.filter(dato=>dato.nombre.toLowerCase().includes(search) || dato.apellidos.toLowerCase().includes(search) || dato.numDocumento.toLowerCase().includes(search) || dato.cargo.toLowerCase().includes(search)).map((item, indice) => {

    return {
        id: indice,
        nombreUsuario: item.nombre,
        apellidoUsuario: item.apellidos,
        documentoUsurio: item.numDocumento,
        tipoDocumento: item.tipoDocumento,
        telefonoUsuario: item.telefono,
        correoUsurio: item.email,
        cargoUsurio: item.cargo,
        actions: item.id,
        rolUsuario: item.rol,
        labAsig:rolM(item)
    }
  })

  const ActionsButtons = ({params, deleteData}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const {value} = params
    const openMenu = Boolean(anchorEl);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    
    const handleOpenDialogDelete = () => setOpenDialogDelete(true);
    const handleCloseDialogDelete = () => setOpenDialogDelete(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setGuardarLaboratorio(usuarioRegistrados[params.row.id])
    };

    const handleClickDelete = async(usurioid) => {
      await deleteData(usurioid)
      setAnchorEl(null);
      setOpenAlertDelete(true);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEliminaryCerrar = () =>{
      handleClickDelete(value); 
      handleCloseDialogDelete()
    }

    return (
      <>
        <Button
          variant="text"
          id="basic-button"
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
        >
          Acciones
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleOpenEdit}>Editar</MenuItem>
          <MenuItem onClick={handleOpenDialogDelete}>Eliminar</MenuItem>
        </Menu>
              
          <div>
            <Dialog
              open={openDialogDelete}
              onClose={handleCloseDialogDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"¿Estás seguro?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Este usuario se elimarará definitivamente 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEliminaryCerrar}>Eliminar</Button>
                <Button onClick={handleCloseDialogDelete} autoFocus> Cancelar </Button>
              </DialogActions>
            </Dialog>
          </div>       
      </>
    )
  }
    
    return (
      <div>
        <Card elevation={5}>
          <CardHeader title="Usuarios" sx={{ textAlign: "center" }} />
          <CardContent>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item md={2} sx={{ flexGrow: 1 }}>
                <Tooltip title="Agregar usuario">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#FF0000",
                      color: "white",
                      mb: 2,
                      "&:hover": { bgcolor: "#9d0000" },
                    }}
                    onClick={() => openDialogCreate()}
                  >
                    <AddIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4}>
                <Paper
                  component="form"
                  sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Buscar Usuario"
                    inputProps={{ "aria-label": "search google maps" }}
                    value={search}
                    onChange={handleChange}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Grid>
            </Grid>
            <DataGrid
              rows={rows}
              columns={columns} 
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
            />
          </CardContent>
        </Card>

        <Dialog open={open} fullWidth={true} maxWidth='md'>
          <Box>
            <Tooltip title="Cerrar ventana">
              <IconButton  onClick={handleClose} >
                  <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <DialogTitle sx={{ textAlign: "center"}}>
            Registro de Usuario
          </DialogTitle>
          <DialogContent>
            <CreateUsuariosForm onAdd={registro} />
            <Container>
              <Grid container rowSpacing={2}  sx={{ my: -5.5}} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                <Grid item xs={12} sx={{textAlign:"right"}}>
                  <Button variant="contained" onClick={handleClose}  sx={{width:"30%", bottom:"140%",bgcolor: "#FF0000", color: "white",
                    "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                </Grid>
              </Grid>   
            </Container>
          </DialogContent>
        </Dialog>

        <Dialog open={openEdit} fullWidth={true}  maxWidth='md'>
                <Box>
                    <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleCloseEdit} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Editar Usuarios
                </DialogTitle>
                <DialogContent>
                    <EditeUserForm updateData={updateData} params={guardarLaboratorio}/>
                    <Container>
                        <Grid container rowSpacing={2}  sx={{ my: -3.5 }}columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                            <Grid item xs={12} sx={{textAlign:"right"}}>
                                <Button variant="contained" onClick={handleCloseEdit}  sx={{width:"30%", bottom:"130%", bgcolor: "#FF0000", color: "white",
                                "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                            </Grid>
                        </Grid> 
                   </Container>     
                </DialogContent>
            </Dialog>

            <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
              <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
                Usuario Eliminado Correctamente!
              </Alert>
            </Snackbar>
      </div>
    );
};

export default UsuariosList;