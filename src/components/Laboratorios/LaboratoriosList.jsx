import React from "react";
import { forwardRef,useState } from "react";
import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";
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
  FormControl,
  InputLabel,
  Select,
  Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateLaboratoriosForm from "./CreateLaboratoriosForm";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sytles ={
  color:"#dc3545",
}
  
const LaboratoriosList = () => {
   
    const {laboratorios, deleteData, addData, updateData} = useAuthLaboratorio();
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
      { field: "Fecha", headerName: "Fecha de registro", width: 140, editable: false },
      { field: "NombreLab", headerName: "Nombre del laboratorio", width: 350, editable: false },
      { field: "Facultad", headerName:"Facultad del laboratorio", width: 250, editable: false },
      { field: "Ubicacion", headerName: "Ubicación fisica", width: 300, editable: false },
      { field: "Coord", headerName: "Coordinador", width: 200, editable: false },
      { field: "Tel", headerName: "Teléfono", width: 110, editable: false },
      { field: "Correo", headerName: "Email", width: 380, editable: false },
      {
        field: "actions",
        headerName: "Acciones",
        width: 150,
        renderCell: (parametros) => <ActionsButtons  params={parametros} deleteData={deleteData} updateData={updateData}/>,
      },
    ];
    
    const rows =  laboratorios.filter(dato=>dato.nombreLaboratorio.toLowerCase().includes(search) || dato.coordinador.toLowerCase().includes(search)).map((item, indice) => {
     
      return {
          id: indice,
          Fecha: item.fechaRegistro,
          NombreLab: item.nombreLaboratorio,
          Facultad:item.facultad,
          Ubicacion:item.ubicacionFisica,
          Coord: item.coordinador,
          Tel: item.telefono,
          Correo: item.email,
          actions: item.id,      
      }
    })

    const ActionsButtons = ({params, deleteData, updateData}) => {  
      const [openModal, setOpenModal] = useState(false);
      const {value} = params
      const [anchorEl, setAnchorEl] = useState(null);
      const openMenu = Boolean(anchorEl);
      const [newLaboratorio, setNewLaboratorio] = useState({
        fechaRegistro: params.row.Fecha,
        nombreLaboratorio: params.row.NombreLab,
        facultad:params.row.Facultad,
        ubicacionFisica: params.row.Ubicacion,
        coordinador: params.row.Coord,
        telefono: params.row.Tel,
        email: params.row.Correo,
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
        setNewLaboratorio({...newLaboratorio,[name]:value})
      };
    
      const handleBlur = (e) =>{
        handleChange(e);
        setError(validate(newLaboratorio));
      }
    
      const handleClickDelete = async(laboratorioid) => {
        await deleteData(laboratorioid)
        setAnchorEl(null);
        setOpenAlertDelete(true);

      };
  
      const handleClickEdit = async(laboratorioid) => {
        setError(validate(newLaboratorio));
        if(Object.keys(error).length ===0){
          await updateData(laboratorioid, newLaboratorio.fechaRegistro, newLaboratorio.nombreLaboratorio, newLaboratorio.facultad, newLaboratorio.ubicacionFisica,newLaboratorio.coordinador, newLaboratorio.telefono,newLaboratorio.email)
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
        const regexEmail = /^[A-Z0-9._%+-]+@[correounivalle]+\.[edu]+\.[co]/i;
        
        if(!values.fechaRegistro){
          errors.fechaRegistro = "Este campo es requerido"
        } if(!values.nombreLaboratorio){
          errors.nombreLaboratorio = "Este campo es requerido"
        }else if(!regexName.test(values.nombreLaboratorio)){
          errors.nombreLaboratorio = "Este campo sólo acepta letras y espacios en blanco"
        }if(!values.facultad){
          errors.facultad = "Este campo es requerido"
        }if(!values.ubicacionFisica){
          errors.telefono = "Este campo es requerido"
        }if(!values.coordinador){
          errors.coordinador = "Este campo es requerido"
        }else if(!regexName.test(values.coordinador)){
          errors.coordinador = "Este campo sólo acepta letras y espacios en blanco"
        }if(!values.email){
          errors.email = "Este campo es requerido"
        }else if(!regexEmail.test(values.email)){
          errors.email = "Este no es un formato válido solo acepta correo institucional"
        }if(!values.telefono){
          errors.telefono = "Este campo es requerido"
        }else if(values.telefono.length < 7){
          errors.telefono = "Este campo debe tener más de 7 dígitos"
        }else if(values.telefono.length > 10){
          errors.telefono = "Este campo no puede tener más de 10 digitos"
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
          
              <Dialog open={openModal} onClose={handleCloseModal} maxWidth='xs'>
                <Box>
                  <Tooltip title="Cerrar ventana">
                    <IconButton  onClick={handleCloseModal} >
                        <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <DialogTitle sx={{ textAlign: "center" }}>
                  Editar Laboratorio
                </DialogTitle>
                <DialogContent>
                  <Container >
                    <Grid container sx={{ p: 1 }}>
                      <Grid item xs={12}>
                        <TextField type="date" onBlur={handleBlur} margin="normal" required fullWidth defaultValue={params.row.Fecha} id="fechaRegistro" label="Fecha de registro" name="fechaRegistro"  
                            autoFocus onChange={handleChange}/>
                        {error.fechaRegistro && <p style={sytles}>{error.fechaRegistro}</p>}
                      </Grid>
                      <Grid item xs={12}>
                        <TextField onBlur={handleBlur} margin="normal" required fullWidth defaultValue={params.row.NombreLab} id="nombreLaboratorio" label="Nombre de laboratorio" name="nombreLaboratorio" 
                            autoFocus onChange={handleChange} />
                        {error.nombreLaboratorio && <p style={sytles }>{error.nombreLaboratorio}</p>}
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl margin="normal" onBlur={handleBlur} fullWidth required>
                            <InputLabel id="select-label" >Facultad</InputLabel>
                            <Select
                              id="facultad"                      
                              label="Facultad del laboratorio"
                              name="facultad"
                              defaultValue={params.row.Facultad}
                              onChange={handleChange}>
                              <MenuItem value={"Ingenieria quimica"}>Ingenieria Química</MenuItem>
                              <MenuItem value={"Departamento de quimica"}>Departamento de Química</MenuItem>
                              <MenuItem value={"No aplica"}>No aplica</MenuItem>
                            </Select>
                          </FormControl>
                        <TextField onBlur={handleBlur} margin="normal" required fullWidth defaultValue={params.row.Ubicacion} id="ubicacionFisica" label="Ubicación fisica" name="ubicacionFisica"  
                            autoFocus onChange={handleChange} />
                        {error.ubicacionFisica && <p style={sytles}>{error.ubicacionFisica}</p>}
                      </Grid>
                      <Grid item xs={12}>
                        <TextField onBlur={handleBlur} margin="normal" required fullWidth defaultValue={params.row.Coord} id="coordinador" label="Coordinador" name="coordinador"  
                            autoFocus onChange={handleChange} />
                        {error.coordinador && <p style={sytles}>{error.coordinador}</p>}
                      </Grid>
                      <Grid item xs={12}>
                        <TextField type="number" onBlur={handleBlur} margin="normal" required fullWidth defaultValue={params.row.Tel} id="telefono" label="Teléfono" name="telefono"  
                            autoFocus onChange={handleChange} />
                        {error.telefono && <p style={sytles}>{error.telefono}</p>}     
                      </Grid>
                      <Grid item xs={12}>
                        <TextField onBlur={handleBlur}  margin="normal" required fullWidth defaultValue={params.row.Correo} id="email" label="Email" name="email"  
                            autoFocus onChange={handleChange} />
                        {error.email && <p style={sytles}>{error.email}</p>}
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign:"center" }}>                      
                        <Button onClick={()=> handleClickEdit(value)} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Editar</Button>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign:"center" }}>
                        <Button onClick={handleCloseModal} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: "#FF0000", "&:hover": { bgcolor: "#9d0000" }}} >Cancelar</Button>
                      </Grid>
                    <Snackbar open={openAler} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
                      <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Laboratorio Editado Correctamente!
                      </Alert>
                    </Snackbar>
                  </Grid> 
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
                    Este laboratorio se elimarará definitivamente 
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
          <CardHeader title="Laboratorios" sx={{ textAlign: "center" }} />
            <CardContent>
              <Grid container sx={{ justifyContent: "space-between" }}>
                <Grid item md={2} sx={{ flexGrow: 1 }}>
                <Tooltip title="Agregar laboratorio">
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
                      placeholder="Buscar Laboratorio"
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

        <Dialog open={open} onClose={() => handleClose()}  fullWidth={true} maxWidth='xs' >
          <Box>
            <Tooltip title="Cerrar ventana">
              <IconButton  onClick={handleClose} >
                  <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
            <DialogTitle sx={{ textAlign: "center" }}>
              Registro de Laboratorios
            </DialogTitle>
            <DialogContent>
              <CreateLaboratoriosForm onAdd={addData}/>
              <Grid item xs={12} sx={{ textAlign:"center" }}>
                <Button variant="contained" onClick={handleClose}  sx={{width:"83%", bgcolor: "#FF0000", color: "white",
                  "&:hover": { bgcolor: "#9d0000" },}}>Cerrar</Button>
              </Grid>      
            </DialogContent>
        </Dialog>

        <Snackbar open={openAlertDelete} autoHideDuration={4000} onClose={handleCloseAlertDelete} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
          <Alert onClose={handleCloseAlertDelete} severity="success" sx={{ width: '100%'}}>
            Laboratorio Eliminado Correctamente!
          </Alert>
        </Snackbar>
      </div>   
    );
};

export default LaboratoriosList;