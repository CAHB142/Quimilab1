import React from "react";
import { forwardRef,useState } from "react";
import { useAuthPruebas } from "../../hooks/AuthContextPruebas";
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
  TextField, 
  Modal,
  Typography,
  Box,
  DialogContentText,
  DialogActions,
  Tooltip,
  Card,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CreatePruebasEnsayosForm from "./CreatePruebasEnsayosForm";


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
  color:"#dc3545",
}

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
  
const PruebasEnsayosList = () => {
   
    const {pruebas, deleteData, addData, updateData} = useAuthPruebas();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openAlertDelete, setOpenAlertDelete] = useState(false);

    const handleCloseAlertDelete = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlertDelete(false);
    }; 

    const handleChange =(evento) =>{
      setSearch(evento.target.value)
    } 
    
    const openDialogCreate = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const columns = [
      { field: "id", headerName: "ID", width: 30 },
      { field: "Nombre", headerName: "Nombre de prueba o ensayo", width: 250, editable: false },
      { field: "CentroCosto", headerName: "Centro de costos", width: 250, editable: false },
      { field: "TipoAct", headerName: "Tipo de actividad", width: 250, editable: false },
      {
        field: "actions",
        headerName: "Acciones",
        width: 100,
        renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData} updateData={updateData}/>,
      },
    ];
    
    const rows =  pruebas.filter(dato=>dato.nombre.toLowerCase().includes(search) || dato.CentroCostos.toLowerCase().includes(search)).map((item, indice) => {
     
      return {
          id: indice,
          Nombre: item.nombre,
          CentroCosto: item.CentroCostos,
          TipoAct: item.tipoActividad,
          actions: item.id,      
      }
    })

    const ActionsButtons = ({params, deleteData, updateData}) => {
  
      const [openModal, setOpenModal] = useState(false);
      const {value} = params
      const [anchorEl, setAnchorEl] = useState(null);
      const openMenu = Boolean(anchorEl);
      const [newPruebaEnsayo, setNewPruebaEnsayo] = useState({
        nombre: params.row.Nombre,
        CentroCostos: params.row.CentroCosto,
        tipoActividad: params.row.TipoAct,
      });
      const [openAler, setOpenAlert] = useState(false);
      const [openDialogDelete, setOpenDialogDelete] = useState(false);
      const [error,setError] = useState({});
    
      const handleOpenMOdal = () => setOpenModal(true);
      const handleCloseModal = () => setOpenModal(false);
      const handleOpenDialogDelete = () => setOpenDialogDelete(true);
      const handleCloseDialogDelete = () => setOpenDialogDelete(false);
       
      const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
          setOpenAlert(false);
      }; 
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      
      const handleChange = ({target: {name, value}}) =>{ 
        setNewPruebaEnsayo({...newPruebaEnsayo,[name]:value})
      };
    
      const handleBlur = (e) =>{
        handleChange(e);
        setError(validate(newPruebaEnsayo));
      }
    
      const handleClickDelete = async(pruebasEnsayosid) => {
        await deleteData(pruebasEnsayosid)
        setAnchorEl(null);
        setOpenAlertDelete(true);
      };
    
      const handleClickEdit = async(pruebasEnsayosid) => {
        setError(validate(newPruebaEnsayo));
        if(Object.keys(error).length ===0){
          await updateData(pruebasEnsayosid, newPruebaEnsayo.nombre, newPruebaEnsayo.CentroCostos, newPruebaEnsayo.tipoActividad)
        }
        setAnchorEl(null);
        setOpenAlert(true);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      
      const handleEliminaryCerrar = () =>{
        handleClickDelete(value); 
        handleCloseDialogDelete()
      }
    
      const validate= (values)=> {
        const errors = {}
        const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        
        if(!values.nombre){
          errors.nombre = "El campo nombre del laboratorio es requerido"
        }else if(!regexName.test(values.nombre)){
          errors.nombre = "El campo nombre de laboratorio sólo acepta letras y espacios en blanco"
        }
        if(!values.CentroCostos){
          errors.CentroCostos = "El campo centro de costos es requerido"
        }if(!values.tipoActividad){
          errors.tipoActividad = "El campo tipo de actividad es requerido"
        }
    
        return errors;
      };
      
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
            <MenuItem onClick={handleOpenMOdal}>Editar</MenuItem>
            <MenuItem onClick={handleOpenDialogDelete}>Eliminar</MenuItem>
          </Menu>
          
              <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleCloseModal} >
                        <CloseIcon />
                    </IconButton>
                  </Tooltip>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center" xs={12} sm={6}>
                         Editar Prueba o ensayo
                    </Typography>
                    <TextField onBlur={handleBlur} margin="normal" required fullWidth value={newPruebaEnsayo.nombre}  defaultValue={params.row.Nombre} id="nombre" label="Nombre de la prueba o ensayo" name="nombre"  
                        autoFocus onChange={handleChange}/>
                    {error.nombre && <p style={sytles}>{error.nombre}</p>}
                    <TextField onBlur={handleBlur} margin="normal" required fullWidth value={newPruebaEnsayo.CentroCostos} defaultValue={params.row.CentroCosto} id="CentroCostos" label="Centro de costos" name="CentroCostos" 
                        autoFocus onChange={handleChange} />
                    {error.CentroCostos && <p style={sytles }>{error.CentroCostos}</p>}
                    <TextField onBlur={handleBlur} margin="normal" required fullWidth value={newPruebaEnsayo.tipoActividad}  defaultValue={params.row.TipoAct} id="tipoActividad" label="Tipo de actividad" name="tipoActividad"  
                        autoFocus onChange={handleChange} />
                    {error.tipoActividad && <p style={sytles}>{error.tipoActividad}</p>}
                    <Button onClick={()=> handleClickEdit(value)} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Editar</Button>
                    <Button onClick={handleCloseModal} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Cancelar</Button>
                    <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                      <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Prueba o ensayo Editado Correctamente!
                      </Alert>
                    </Snackbar>
                </Box>
            </Modal>
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
                    Esta prueba o ensayo se elimarará definitivamente 
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleEliminaryCerrar}>Eliminar</Button>
                  <Button onClick={handleCloseDialogDelete} autoFocus>
                    Cancelar
                  </Button>
                </DialogActions>
              </Dialog> 
          </div>
        </>
      )
    }
    
    return (
    <div>
      <Card elevation={5}>          
        <CardHeader title="Pruebas o ensayos de laboratorio" sx={{ textAlign: "center" }} />
          <CardContent>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item md={2} sx={{ flexGrow: 1 }}>
              <Tooltip title="Agregar prueba o ensayo">
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
                    placeholder="Buscar prueba o ensayo"
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
          <Dialog open={open} onClose={() => handleClose()} fullWidth={true}  maxWidth='xs'>
          <Box>
            <Tooltip title="Cerrar ventana">
              <IconButton  onClick={handleClose} >
                  <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
            <DialogTitle sx={{ textAlign: "center" }}>
              Registro de Pruebas o Ensayos
            </DialogTitle>
            <DialogContent>
              <CreatePruebasEnsayosForm onAdd={addData}/>
              <Grid item xs={12} sx={{ textAlign:"center" }}>
                <Button variant="contained" onClick={handleClose}  sx={{width:"84%", bgcolor: "#FF0000", color: "white",
                  "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
              </Grid>      
            </DialogContent>
        </Dialog>
        <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
                  Prueba o ensayo Eliminado Correctamente!
                </Alert>
              </Snackbar>
       
    </div>

    
    );
};

export default PruebasEnsayosList;