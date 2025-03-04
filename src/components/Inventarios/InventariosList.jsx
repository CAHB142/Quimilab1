import React from "react";
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
  Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CreateInventariosForm from './CreateInventariosForm'
import { useAuthInventarios } from "../../hooks/AuthContextInventarios";
import EditarFormulario from "./EditarFormulario";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const InventariosList = () => {

    const [guardarNombre, setGuardarNombre] = useState()
    const {inventarios, deleteData, addInv, updateData} = useAuthInventarios();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openAlertDelete, setOpenAlertDelete] = useState(false);

    const handleCloseAlertDelete = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlertDelete(false);
    }; 
    const handleOpenMOdal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false);
    const handleChange =(evento) =>{setSearch(evento.target.value)}       
    const openDialogCreate = () => {setOpen(true);};
    const handleClose = () => {setOpen(false);};

    const columns = [
        { field: "id", headerName: "ID", width: 30 },
        { field: "Codigo", headerName: "Código", width: 100, editable: false },    
        { field: "Seccion", headerName: "Sección", width: 300, editable: false },
        { field: "NombreReactivo", headerName: "Nombre del reactivo", width: 200, editable: false },
        { field: "Concentracion", headerName: "Concentración", width:200, editable:false},
        { field: "CantidadReactivo", headerName: "Cantidad del reactivo", width:200, editable:false},
        { field: "Marca", headerName: "Marca", width:200, editable:false},
        { field: "CapacidadRecipiente", headerName: "Cantidad del recipiente", width:200, editable:false},
        { field: "TipoRecipiente", headerName: "Tipo de recipiente", width:200, editable:false},
        { field: "FechaVencimiento", headerName: "Fecha de vencimiento", width:200, editable:false},
        { field: "FechaAdquisicion", headerName: "Fecha de adquisicion", width:200, editable:false},
        { field: "EtiquetaSGA", headerName: "Etiqueta de SGA", width:200, editable:false},
        { field: "Almacenamiento", headerName: "Almacenamiento", width:200, editable:false},
        {
          field: "actions",
          headerName: "Acciones",
          width: 100,
          renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData} updateData={updateData}/>,
        },
    ];

    
    const asignarNombreReactivo = (index)=>{
        return index.nombreReactivo.Nombre
    }

    const rows =  inventarios.filter(dato=>dato.codigo.toLowerCase().includes(search) || asignarNombreReactivo(dato).toLowerCase().includes(search) || dato.seccion.toLowerCase().includes(search) || dato.fechaVencimiento.toLowerCase().includes(search) || dato.almacenamiento.toLowerCase().includes(search) || dato.concentracion.toLowerCase().includes(search) || dato.etiquetaSGA.toLowerCase().includes(search)).map((item, indice) => {         
        return {
            id: indice,
            Codigo:item.codigo,
            Seccion: item.seccion,
            NombreReactivo: asignarNombreReactivo(item),
            Concentracion: item.concentracion,
            CantidadReactivo: item.cantidadReactivo,
            Marca: item.marca,
            CapacidadRecipiente: item.capacidadRecipiente,
            TipoRecipiente: item.tipoRecipiente,
            FechaVencimiento: item.fechaVencimiento,
            FechaAdquisicion: item.fechaAdquisicion,
            EtiquetaSGA: item.etiquetaSGA,
            Almacenamiento: item.almacenamiento,
            actions: item.id,      
        }
    })

    const ActionsButtons = ({params, deleteData}) => {

      const [anchorEl, setAnchorEl] = useState(null);
      const openMenu = Boolean(anchorEl);    
      const {value} = params
      const [openDialogDelete, setOpenDialogDelete] = useState(false);
      const handleOpenDialogDelete = () => setOpenDialogDelete(true);
      const handleCloseDialogDelete = () => setOpenDialogDelete(false);
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(setGuardarNombre(inventarios[params.row.id]))
      };
        
    
      const handleClickDelete = async(pruebasEnsayosid) => {
          await deleteData(pruebasEnsayosid)
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
          >Acciones</Button>
    
          <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          >
              <MenuItem onClick={handleOpenMOdal}>Editar</MenuItem>
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
                  Este inventario se elimarará definitivamente 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEliminaryCerrar}>Eliminar</Button>
                <Button onClick={handleCloseDialogDelete} autoFocus>Cancelar</Button>
                
              </DialogActions>
            </Dialog> 
        </div>
      </>
      );
    };

    return (
    
        <div>
            <Card elevation={5}> 
                <CardHeader title="Inventarios" sx={{ textAlign: "center" }} />
                <CardContent>
                    <Grid container sx={{ justifyContent: "space-between" }}>
                        <Grid item md={2} sx={{ flexGrow: 1 }}>
                            <Tooltip title="Agregar inventario">
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
                                placeholder="Buscar inventario"
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

            <Dialog open={open} onClose={() => handleClose()} fullWidth={true}  maxWidth='md'>
                <Box>
                    <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleClose} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Registro de Inventarios
                </DialogTitle>
                <DialogContent>
                   <CreateInventariosForm onAdd={addInv}/>
                   <Container>
                   <Grid container rowSpacing={1}  sx={{ my: -5.5 }}columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                        <Grid item xs={12} sx={{textAlign:"right"}}>
                            <Button variant="contained" onClick={handleClose}  sx={{width:"30%", bgcolor: "#FF0000", color: "white",
                            "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                        </Grid>
                    </Grid> 
                   </Container>                   
                </DialogContent>
            </Dialog>

            <Dialog open={openModal} onClose={() => handleCloseModal()} fullWidth={true}  maxWidth='md'>
                <Box>
                    <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleCloseModal} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Editar Inventarios
                </DialogTitle>
                <DialogContent>
                    <EditarFormulario updateData={updateData} params={guardarNombre}/>
                    <Container>
                        <Grid container rowSpacing={1}  sx={{ my: -7.5 }}columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                            <Grid item xs={12} sx={{textAlign:"right"}}>
                                <Button variant="contained" onClick={handleCloseModal}  sx={{width:"30%", bgcolor: "#FF0000", color: "white",
                                "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
                            </Grid>
                        </Grid> 
                   </Container>     
                </DialogContent>
            </Dialog>

            <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
                    Inventario Eliminado Correctamente!
                </Alert>
            </Snackbar>
        </div>

    );

};

export default InventariosList