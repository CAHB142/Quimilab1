import React from 'react'
import { forwardRef,useState } from "react";
import {
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Grid,
  InputBase,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Menu,
  MenuItem,
  Box,
  DialogContentText,
  DialogActions,
  Tooltip,
  Card,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CreateForm from './CreateForm'
import { useAuthBolsaReactivo } from "../../hooks/AuthContextBolsaReactivos";
import EditForm from "./EditForm";
import RequestForm from './RequestForm';
import {useAuth} from '../../context/AuthContext'
import {useAuthRequest} from '../../hooks/AuthContextRequest'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BolsaReactivosList = () => {

    const [guardarNombreReactivo, setGuardarNombreReactivo] = useState()
    const {bolsaReactivos, deleteData, addData, updateData, updateEstado} = useAuthBolsaReactivo();
    const [openCreate, setOpenCreate] = useState(false)
    const [search, setSearch] = useState("");
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [openSolicitud, setOpenSolicitud] = useState(false);
    const {usere} = useAuth()
    const [openAlertDelete, setOpenAlertDelete] = useState(false);
    const [openAlertCambiarEstado, setOpenAlertCambiarEstado] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);


    const handleCloseAlertDelete = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertDelete(false);
    };

    const handleCloseAlertCambiarEstado = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertCambiarEstado(false);
    };

    const handleOpenDialogEdit = () => setOpenDialogEdit(true)
    const handleCloseDialogEdit = () => setOpenDialogEdit(false);
    
    const handleChange =(evento) =>{setSearch(evento.target.value)}       
    const openDialogCreate = () => {setOpenCreate(true)};
    const handleClose = () => {setOpenCreate(false)};
    const handleOpenDialogSolicitud = () => {setOpenSolicitud(true)};
    const handleCloseSolicitud = () => {setOpenSolicitud(false)};

    const columns = [
        { field: "id", headerName: "ID", width: 30 },
        { field: "FechaRegistro", headerName: "Fecha de la donación", width: 160, editable: false },    
        { field: "NombreReactivo", headerName: "Nombre del reactivo", width: 250, editable: false },    
        { field: "Cantidad", headerName: "Cantidad", width: 100, editable: false },
        { field: "Responsable", headerName: "Responsable", width: 200, editable: false},
        { field: "Telefono", headerName: "Teléfono", width:130, editable:false},
        { field: "Ubicacion", headerName: "Ubicación", width:400, editable:false},
        { field: "Estado", headerName: "Estado", width:100, editable:false},
        {
          field: "actions",
          headerName: "Acciones",
          width: 100,
          renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData} updateData={updateData}/>,
        },
    ];

    const asignarNombreReactivo = (index)=>{
        return index.nomReactivo.Nombre
    }

    const getNombreLab = (index)=>{
        return index.lugar.nombreLaboratorio
    }

    const rows =  bolsaReactivos.filter(dato=>dato.fechaRegistro.toLowerCase().includes(search) || asignarNombreReactivo(dato).toLowerCase().includes(search) || dato.responsable.toLowerCase().includes(search) || dato.estado.toLowerCase().includes(search) || dato.lugar.toLowerCase().includes(search)).map((item, indice) => {         
        return {
            id: indice,
            FechaRegistro:item.fechaRegistro,
            NombreReactivo: asignarNombreReactivo(item),
            Cantidad: item.cantidad,
            Responsable: item.responsable,
            Telefono: item.telefono,
            Ubicacion: getNombreLab(item),
            Estado: item.estado,
            actions: item.id,      
        }
    })

    const ActionsButtons = ({params, deleteData }) => {

        const [anchorEl, setAnchorEl] = useState(null);
        const openMenu = Boolean(anchorEl);    
        const {value} = params
      
        const [openCambiarEstado, setOpenCambiarEstado] = useState(false);
        const handleOpenDialogEstado = () => {
            setOpenCambiarEstado(true)
            setNewEstado(params.row.Estado)
        }
        const [newEstado, setNewEstado] = useState()

        const handleChangeEstado = ({target: {name, value}}) =>{ 
            setNewEstado(value)
        };

        const handleCloseDialogEstado = () => setOpenCambiarEstado(false)
        const handleOpenDialogDelete = () => setOpenDialogDelete(true);
        const handleCloseDialogDelete = () => setOpenDialogDelete(false);
    
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
            console.log(setGuardarNombreReactivo(bolsaReactivos[params.row.id]))
        };
        
        const handleClickDelete = async(bolsaReactivoId) => {
            await deleteData(bolsaReactivoId)
            setAnchorEl(null);
            setOpenAlertDelete(true);
        };

        const handleCambiarEstado = async(bolsaReactivoId) =>{
            await updateEstado(bolsaReactivoId, newEstado)
            setOpenAlertCambiarEstado(true);

        }

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleEliminaryCerrar = () =>{
            handleClickDelete(value); 
            handleCloseDialogDelete()
        }

        return(
            <>
                <Button variant="text" id="basic-button" aria-controls={openMenu ? "basic-menu" : undefined} aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined} onClick={handleClick}>
                    Acciones
                </Button>
                
                <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleClose} MenuListProps={{
                    "aria-labelledby": "basic-button",}}>    
                    <MenuItem onClick={handleOpenDialogSolicitud}>Solicitar</MenuItem>

                    {usere.rol !== "Generador" && <MenuItem onClick={handleOpenDialogEstado}>Cambiar estado</MenuItem>}
                    {usere.rol !== "Generador" && <MenuItem onClick={handleOpenDialogEdit}>Editar</MenuItem>} 
                    {usere.rol !== "Generador" && <MenuItem onClick={handleOpenDialogDelete}>Eliminar</MenuItem>}
                </Menu>

                <div>
                    <Dialog open={openDialogDelete} onClose={handleCloseDialogDelete} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"¿Estás seguro?"}
                        </DialogTitle>    
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Este Donación se elimarará definitivamente 
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEliminaryCerrar}>Eliminar</Button>
                            <Button onClick={handleCloseDialogDelete} autoFocus>Cancelar</Button>
                               
                        </DialogActions>
                        
                    </Dialog>
                    
                </div>  
               
                <div>
                <Dialog open={openCambiarEstado} onClose={handleCloseDialogEstado}  maxWidth='xs'>
                    <Box>
                        <Tooltip title="Cerrar ventana">
                        <IconButton  onClick={handleCloseDialogEstado} >
                            <CloseIcon />
                        </IconButton>
                        </Tooltip>
                    </Box>
                    <DialogTitle id="alert-dialog-title">
                        Cambiar Estado de la donación
                    </DialogTitle>  
                    <DialogContent>
                        <Grid sx={{ my: 1  }} >
                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={newEstado}
                                    label="Estado"
                                    onChange={handleChangeEstado}
                                >   
                                    <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
                                    <MenuItem value={"Aceptado"}>Aceptado</MenuItem>
                                    <MenuItem value={"Rechazado"}>Rechazado</MenuItem>
                                </Select>
                            </FormControl>
                            <Grid sx={{p:0}} spacing={0}>
                                <Grid item xs={12}>
                                    <Button onClick={()=> handleCambiarEstado(value)} type="submit" fullWidth variant="contained" sx={{width:"100%", mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Aceptar</Button>
                                </Grid> 
                                <Grid item xs={12}>
                                    <Button onClick={handleCloseDialogEstado} type="submit" fullWidth variant="contained" sx={{width:"100%", mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Cerrar</Button>
                                </Grid> 
                            </Grid>                        
                        </Grid>               
                    </DialogContent>

                </Dialog>
                    
                </div>         
            </>
        )
    }

    return (
        <div>
            <Card elevation={5}> 
                <CardHeader title="Bolsa de reactivos" sx={{ textAlign: "center" }} />
                <CardContent>
                    <Grid container sx={{ justifyContent: "space-between" }}>
                        <Grid item md={2} sx={{ flexGrow: 1 }}>
                            <Tooltip title="Agregar donación">
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
                                placeholder="Buscar donaciones"
                                inputProps={{ "aria-label": "search google maps" }}
                                value={search}
                                onChange={handleChange}
                            />
                                <SearchIcon />
                            </Paper>
                        </Grid>
                    </Grid>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        heckboxSelection
                        initialState={{
                            pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                    />
                </CardContent>
            </Card>

            <Dialog open={openCreate} onClose={() => handleClose()} fullWidth={true}  maxWidth='xs'>
                <Box>
                    <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleClose} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Registro de Donaciones
                </DialogTitle>
                <DialogContent>
                   <CreateForm onAdd={addData}/>
                    <Grid item xs={12} sx={{ textAlign:"center" }}>
                        <Button variant="contained" onClick={handleClose}  sx={{width:"83%", bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                    </Grid>                       
                </DialogContent>
            </Dialog>

            <Dialog open={openDialogEdit} onClose={() => handleCloseDialogEdit()} fullWidth={true}  maxWidth='xs'>
                <Box>
                    <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleCloseDialogEdit} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Editar Donaciones
                </DialogTitle>
                <DialogContent>
                    <EditForm updateData={updateData} params={guardarNombreReactivo}/>
                    <Grid item xs={12} sx={{ textAlign:"center" }}>
                        <Button variant="contained" onClick={handleCloseDialogEdit}  sx={{width:"83%", bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                    </Grid>  
                </DialogContent>
            </Dialog>

            <Dialog open={openSolicitud} onClose={() => handleCloseSolicitud()} fullWidth={true}  maxWidth='xs'>
                <Box>
                    <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleCloseSolicitud} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Solicitud de Donaciones
                </DialogTitle>
                <DialogContent>
                    <RequestForm params={guardarNombreReactivo}/>
                    <Grid item xs={12} sx={{ textAlign:"center" }}>
                        <Button variant="contained" onClick={handleCloseSolicitud}  sx={{width:"84%", bgcolor: "#FF0000", color: "white",
                        "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                    </Grid>  
                </DialogContent>
            </Dialog>

            <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
                    Donación Eliminada Correctamente!
                </Alert>
            </Snackbar>
            
            <Snackbar open={openAlertCambiarEstado} autoHideDuration={4000} onClose={handleCloseAlertCambiarEstado} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                <Alert onClose={handleCloseAlertCambiarEstado} severity="success" sx={{ width: '100%'}}>
                    Cambio de Estado realizado Correctamente!
                </Alert>
            </Snackbar>


        </div>
    )


}

export default BolsaReactivosList