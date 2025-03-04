import React, {useState, forwardRef}from 'react'
import {
    CardContent,
    CardHeader,
    Button,
    Grid,
    InputBase,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    Menu,
    MenuItem,
    DialogContentText,
    DialogActions,
    Card,
  } from "@mui/material";
  import { DataGrid } from "@mui/x-data-grid";
  import SearchIcon from "@mui/icons-material/Search";
  import Snackbar from '@mui/material/Snackbar';
  import MuiAlert from '@mui/material/Alert';
  import {useAuthRequest} from "../../hooks/AuthContextRequest"

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SolicitudesList = () =>{

    const {solicitudes, deleteData} = useAuthRequest();
    const [search, setSearch] = useState("");
    const [openAlertDelete, setOpenAlertDelete] = useState(false);
    
    const handleCloseAlertDelete = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertDelete(false);
    };
    const handleChangeBuscar =(evento) =>{setSearch(evento.target.value)}       

    const columns = [
        { field: "id", headerName: "ID", width: 30 },
        { field: "FechaSolicitud", headerName: "Fecha de la solicitud", width: 160, editable: false },    
        { field: "NombreReactivoSolicitud", headerName: "Nombre del reactivo", width: 250, editable: false },    
        { field: "CantidadSolicitud", headerName: "Cantidad", width: 100, editable: false },
        { field: "ResponsableSolicitud", headerName: "Responsable", width: 200, editable: false },
        { field: "TelefonoSolicitud", headerName: "Teléfono", width:130, editable:false},
        { field: "UbicacionSolicitud", headerName: "Ubicación", width:300, editable:false},
        {
          field: "actions",
          headerName: "Acciones",
          width: 100,
          renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData}/>,
        },
    ];

    const getNombreLab = (index)=>{
        return index.lugarSolicitud.nombreLaboratorio
    }

    const rows =  solicitudes.filter(dato=>dato.fechaRegistroSolicitud.toLowerCase().includes(search) || dato.nombreReactivoSolicitud.toLowerCase().includes(search) || dato.responsableSolicitud.toLowerCase().includes(search) || getNombreLab(dato).toLowerCase().includes(search)).map((item, indice) => {         
        return {
            id: indice,
            FechaSolicitud:item.fechaRegistroSolicitud,
            NombreReactivoSolicitud: item.nombreReactivoSolicitud,
            CantidadSolicitud: item.cantidadSolicitud,
            ResponsableSolicitud: item.responsableSolicitud,
            TelefonoSolicitud: item.telefonoSolicitud,
            UbicacionSolicitud: getNombreLab(item),
            actions: item.id,      
        }
    })

    const ActionsButtons = ({params, deleteData }) => {

        const [anchorEl, setAnchorEl] = useState(null);
        const openMenu = Boolean(anchorEl);    
        const {value} = params
        const [openDialogDelete, setOpenDialogDelete] = useState(false);

        const handleOpenDialogDelete = () => setOpenDialogDelete(true);
        const handleCloseDialogDelete = () => setOpenDialogDelete(false);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClickDelete = async(bolsaReactivoId) => {
            await deleteData(bolsaReactivoId)
            setOpenAlertDelete(true);
        };

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
                    <MenuItem onClick={handleOpenDialogDelete}>Eliminar</MenuItem>
                </Menu>

                <div>
                    <Dialog open={openDialogDelete} onClose={handleCloseDialogDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"¿Estás seguro?"}
                        </DialogTitle> 
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                            Esta solicitud de donaciónse elimarará definitivamente 
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEliminaryCerrar}>Eliminar</Button>
                            <Button onClick={handleCloseDialogDelete} autoFocus>Cancelar</Button>
                        </DialogActions>                                   
                    </Dialog>                 
                </div>  
                    
            </>
        )
    }

    return (
        <div>
            <>
                <Card elevation={5}> 
                    <CardHeader title="Solicitudes de Donaciones" sx={{ textAlign: "center" }} />
                    <CardContent>
                            <Grid container sx={{my:2}} fulldwith direction="row" justifyContent="flex-end" alignItems="flex-start">
                                <Paper
                                component="form" 
                                sx={{ width: '34%', p: "2px 4px", display: "flex", alignItems: "center" }}
                                >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Buscar solicitudes"
                                    inputProps={{ "aria-label": "search google maps" }}
                                    value={search}
                                    onChange={handleChangeBuscar}
                                />
                                    <SearchIcon />
                                </Paper>
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
            </>
                   
            <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
                Solicitud de Donación Eliminada Correctamente!
                </Alert>
            </Snackbar>     
        </div>
        
    )
}

export default SolicitudesList
