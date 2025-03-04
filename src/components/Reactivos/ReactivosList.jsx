import React from "react";
import { forwardRef, useState } from "react";
import { useAuthReactivos } from "../../hooks/AuthContextReactivos";
import {
  Card,
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
  Link,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  DialogActions,
  Tooltip,
  Container
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateReactivosForm from "./CreateReactivosForm";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

  
const ReactivosList = () => {
   
    const {reactivos, deleteData, addData, updateData, uploadFile, updateDataHojaseguridad, deleteFile} = useAuthReactivos();
    const [openAler, setOpenAlert] = useState(false);
    const [openAlerGuardar, setOpenAlertGuardar] = useState(false);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");;
    const [openAlertDelete, setOpenAlertDelete] = useState(false);

    const handleChange =(evento) =>{
      setSearch(evento.target.value)
    }

    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlert(false);
    }; 

    const handleCloseAlertGuardar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlertGuardar(false);
    }; 

    const handleCloseAlertDelete = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlertDelete(false);
    }; 
    
    const openDialogCreate = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const columns = [
      { field: "id", headerName: "ID", width: 40 },
      { field: "nameReactivo", headerName: "Nombre", width: 280, editable: false },
      { field: "sinonimoReactivo", headerName: "Sinonimos", width: 280, editable: false },
      { field: "estadoFisico", headerName: "Estado Fisico", width: 140, editable: false },
      { field: "NamIngle", headerName: "Nombre Ingles", width: 280, editable: false },
      { field: "casReactivo", headerName: "CAS", width: 150, editable: false },
      { field: "hojaSeguridad", 
        headerName: "Hoja Seguridad", 
        width: 200, 
        
        renderCell: (parametros) =>  <Link  href={parametros.row.hojaSeguridad}> {parametros.row.hojaSeguridad}</Link>,
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 150,
        renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData} updateData={updateData} uploadFile={uploadFile} updateDataHojaseguridad={updateDataHojaseguridad} deleteFile={deleteFile}/>,
      },
    ];
    
    const rows =  reactivos.filter(dato=>dato.Nombre.toLowerCase().includes(search) || dato.Cas.toLowerCase().includes(search)).map((item, indice) => {
      
      return {
          id: indice,
          nameReactivo: item.Nombre,
          sinonimoReactivo: item.Sinonimo,
          estadoFisico: item.EstadoFisico,
          hojaSeguridad: item.HojaSeguridad,
          casReactivo: item.Cas,
          NamIngle: item.NombreIngles,
          actions: item.id,
      }
    })

    const ActionsButtons = ({params, deleteData, updateData, uploadFile, updateDataHojaseguridad, deleteFile}) => {
  
      const [file, setFile] = useState({
        filee:"",
      });
      const [openModalHS, setOpenModalHS] = useState(false);
      const handleCloseModalHS = () => setOpenModalHS(false);
      const handleOpenModalHS = () => setOpenModalHS(true);
      const {value} = params
      const [anchorEl, setAnchorEl] = useState(null);
      const openMenu = Boolean(anchorEl);
      const [openDialogDelete, setOpenDialogDelete] = useState(false);
      const [error,setError] = useState({});
      const handleOpenDialogDelete = () => setOpenDialogDelete(true);
      const handleCloseDialogDelete = () => setOpenDialogDelete(false);
      const [openEdit, setOpenEdit] = useState(false);
      const [openAler, setOpenAlert] = useState(false);
      const [newReactivo, setNewReactivo] = useState({
        Nombre: params.row.nameReactivo,
        Sinonimos: params.row.sinonimoReactivo,
        NombreIn: params.row.NamIngle,
        Cas: params.row.casReactivo,
        EstadoFi: params.row.estadoFisico,
      });    
      const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
          setOpenAlert(false);
      }; 
    
    
      const openDialogEdit = () => {
        setOpenEdit(true);
      };
      const handleCloseEdit = () => {
        setOpenEdit(false);
      };
      
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      
      const handleChange = ({target: {name, value}}) =>{ 
        setNewReactivo({...newReactivo,[name]:value})
      };
    
      const handleBlur = (e) =>{
        handleChange(e);
        setError(validate(newReactivo));
      }
    
      const handleClickDelete = async(reactivoid) => {
        await deleteData(reactivoid)
        await deleteFile(reactivoid)
        setAnchorEl(null);
        setOpenAlertDelete(true);    
      };
    
      const handleClickEdit = async(reactivoid) => {
        setError(validate(newReactivo));
        if(Object.keys(error).length ===0){
          await updateData(reactivoid, newReactivo.Nombre, newReactivo.Sinonimos, newReactivo.NombreIn, newReactivo.Cas,newReactivo.EstadoFi)
        }
        setOpenAlert(true);
      };
    
      const handleClickGuardar = async(reactivoid) => {
        const result = await uploadFile(file.filee, reactivoid)
        await updateDataHojaseguridad(reactivoid, result)
        setOpenAlertGuardar(true);
        setAnchorEl(null);
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
        const regexCas = /^\d{2,7}-\d{2}-\d{1}$/;
    
        if(!values.Nombre){
          errors.Nombre = "El campo nombre es requerido"
        }if(!values.Sinonimos){
          errors.Sinonimos = "El campo sinónimos es requerido"
        }else if(!regexName.test(values.Sinonimos)){
          errors.Sinonimos = "El campo sinónimos sólo acepta letras y espacios en blanco"
        }if(!values.NombreIn){
          errors.NombreIn = "El campo nombre en inglés es requerido"
        }else if(!regexName.test(values.NombreIn)){
          errors.NombreIn = "El campo nombre en inglés sólo acepta letras y espacios en blanco"
        }if(!values.Cas){
          errors.Cas = "El campo número CAS es requerido"
        }else if(!regexCas.test(values.Cas)){
          errors.Cas = "El campo solo acepta el formato xxxxxxx-xx-x"
        }if(!values.EstadoFi){
          errors.EstadoFi = "El campo estado fisico es requerido"
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
            <MenuItem onClick={handleOpenModalHS}>Guardar Hoja Seguridad</MenuItem>
            <MenuItem onClick={openDialogEdit}>Editar</MenuItem>
            <MenuItem onClick={handleOpenDialogDelete}>Eliminar</MenuItem>
          </Menu>
          <Container>
              <Modal
              open={openModalHS}
              onClose={handleCloseModalHS}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <IconButton   onClick={handleCloseModalHS}>
                    <CloseIcon />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center" xs={12} sm={6}>
                      Guardar Hoja de Seguridad
                    </Typography>
                    <input type="file" name="file" id="file" onChange={(e) => setFile({...file, filee: e.target.files[0]})}/>
                    <Button onClick={()=> handleClickGuardar(value)} type="submit" color="inherit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                    "&:hover": { bgcolor: "#9d0000" },}} >Guardar</Button>
                    <Button onClick={handleCloseModalHS} type="submit" color="inherit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                      "&:hover": { bgcolor: "#9d0000" },}}>Cancelar</Button>
                </Box>
            </Modal>
            
          </Container>
    
          <Dialog open={openEdit} fullWidth maxWidth='xs'>
            <Box>
                <Tooltip title="Cerrar ventana">
                  <IconButton onClick={handleCloseEdit}>
                      <CloseIcon />
                    </IconButton>
                </Tooltip>         
            </Box>  
            <DialogTitle sx={{ textAlign: "center" }}>
              Editar Reactivo
            </DialogTitle>
            <DialogContent>
            <Container >
              <Grid container sx={{ p: 1 }}>
                <Grid item xs={12}>
                  <TextField margin="normal" required fullWidth  onBlur={handleBlur} defaultValue={params.row.nameReactivo} id= "Nombres" label="Nombre" name="Nombre"  
                    autoFocus onChange={handleChange}/>
                  {error.Nombre && <p style={sytles}>{error.Nombre}</p>}
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" required fullWidth onBlur={handleBlur} defaultValue={params.row.sinonimoReactivo} id="Sinonimos" label="Sinonimos" name="Sinonimos" 
                    autoFocus onChange={handleChange} />
                  {error.Sinonimos && <p style={sytles}>{error.Sinonimos}</p>}
                </Grid>
                <Grid item xs={12}>
                  <FormControl margin="normal" fullWidth required onBlur={handleBlur} >
                    <InputLabel id="select-label" >Estado Fisico</InputLabel>
                        <Select
                          id="EstadoFi"
                          label="Estado Fisico"
                          name="EstadoFi"
                          defaultValue={params.row.estadoFisico} 
                          onChange={handleChange}>
                            <MenuItem value={"Liquido"}>Liquido</MenuItem>
                            <MenuItem value={"Solido"}>Solido</MenuItem>
                            <MenuItem value={"Gas"}>Gas</MenuItem>
                        </Select>
                  </FormControl>
                  {error.EstadoFi && <p style={sytles}>{error.EstadoFi}</p>}
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" required fullWidth onBlur={handleBlur} defaultValue={params.row.NamIngle} id="NombreIn" label="Nombre Ingles" name="NombreIn"  
                    autoFocus onChange={handleChange} />
                    {error.NombreIn && <p style={sytles}>{error.NombreIn}</p>}
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" required fullWidth onBlur={handleBlur} defaultValue={params.row.casReactivo} id="Cas" label="cas" name="Cas"  
                    autoFocus onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sx={{ textAlign:"center" }}>
                  <Button onClick={()=> handleClickEdit(value)} type="submit" color="inherit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                    "&:hover": { bgcolor: "#9d0000" },}} >Editar</Button>
                </Grid>
                <Grid item xs={12} sx={{ textAlign:"center" }}>
                  <Button onClick={handleCloseEdit} type="submit" color="inherit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", color: "white",
                    "&:hover": { bgcolor: "#9d0000" },}} >Cancelar</Button>
                </Grid>
              </Grid>
              <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                  <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                    Reactivo Editado Correctamente!
                  </Alert>
                </Snackbar>
              </Container>
    
            </DialogContent>
          </Dialog>  
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
                  Este Reactivo se elimarará definitivamente 
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
          <CardHeader title="Reactivos" sx={{ textAlign: "center" }} />
          <CardContent>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item md={2} sx={{ flexGrow: 1 }}>
              <Tooltip title="Agregar reactivo">
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
                    placeholder="Buscar Reactivo"
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
        <Dialog open={open} fullWidth={true} maxWidth='xs'>
          <Box>
            <Tooltip title="Cerrar ventana">
              <IconButton  onClick={handleClose} >
                  <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <DialogTitle sx={{ textAlign: "center" }}>
            Registro de Reactivos
          </DialogTitle>
          <DialogContent>
            <CreateReactivosForm onAdd={addData}/>
            <Grid item xs={12} sx={{ textAlign:"center" }}>
              <Button variant="contained" onClick={handleClose}  sx={{width:"84%", bgcolor: "#FF0000", color: "white",
                "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
            </Grid>
          </DialogContent>
        </Dialog>
        <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Reactivo registrado Correctamente!
        </Alert>
      </Snackbar>

      <Snackbar open={openAlerGuardar} autoHideDuration={4000} onClose={handleCloseAlertGuardar}  anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                  <Alert onClose={handleCloseAlertGuardar} severity="success" sx={{ width: '100%' }}>
                    Guardado Correctamente!
                  </Alert>
                </Snackbar>
                <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                  <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
                    Reactivo Eliminado Correctamente!
                  </Alert>
                </Snackbar>
        
      </div>
    );
};

export default ReactivosList;