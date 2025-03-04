import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
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
  CircularProgress,
  Box,
  Typography,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateStatementForm from "./CreateStatementForm";
import StatementInfo from "./StatementInfo";
import { useState } from "react";
import { useAuthStatement } from "../../hooks/AuthContextStatements"
import { useAuth as useAuthUsuarios } from "../../hooks/AuthContextUsuarios";
import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";
import { useAuth } from "../../context/AuthContext";
import { useAuthPruebas } from "../../hooks/AuthContextPruebas";

const StatementsList = (props) => {
  const { statements, deleteStatement, getStatementsByUser, getStatements, waste, getCorrientes } = useAuthStatement()
  const { user, getUserById, usuarioRegistrados } = useAuthUsuarios()
  const {getData:getPruebas, pruebas} = useAuthPruebas()
  const { usere } = useAuth()
  const { getData, laboratorios } = useAuthLaboratorio()
  //const [anchorEl, setAnchorEl] = useState(null);
  //const openMenu = Boolean(anchorEl);
  const [open, setOpen] = useState(false);
  const [openStatement, setOpenStatement] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)
  const [cantidad, setCantidad] = useState(0)
  const [searchStatement, setSearchStatement] = useState("")
  const [alert, setAlert] = useState({ state: false, error: false, message: '' })
  const [openDelete, setOpenDelete] = useState(false)
  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "rgba(0,0,0,0.8)",
      color: 'white',
      fontSize: 16,
    },
  }));

  const handleCloseMenu = () => {
    //setAnchorEl(null);
  };

  const openDialogCreate = () => {
    getPruebas()
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const openDialogStatement = () => {
    console.log(itemSelected)
    getUserById(itemSelected.id_generador)
    getCorrientes()
    setOpenStatement(true);
  };
  const handleCloseStatement = () => {
    setOpenStatement(false);
  };

  const handleSearchStatement = (event) => {
    setSearchStatement(event.target.value)
    console.log(event.target.value)
  }

  const deleteSt = async () => {
    await deleteStatement(itemSelected);
    setAlert({state:true, message: "Declaración eliminada con éxito", error:false})
    setOpenDelete() 
  }

  const ContextMenuCell = ({ params }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setItemSelected(statements.find(st => st.id === params.row.id));
      console.log(statements[params.row.id])
    };

    const handleCloseM = () => {
      setAnchorEl(null);
    };

    const handleMenuItemClick = () => {
      console.log('slddhkj')
      //console.log(selectedRowIndex);
      alert(itemSelected)
      handleCloseM();
    };

    return (
      <>
        <Button
          variant="text"
          id="basic-button"
          aria-controls={openMenu ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? 'true' : undefined}
          onClick={handleClick}
        >
          Acciones
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseM}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={openDialogStatement}>Ver</MenuItem>
          {usere.rol !== "Generador" && <MenuItem onClick={async () => { setOpenDelete(true); }}>Eliminar</MenuItem>}
        </Menu>
      </>
    );
  };

  const sumaCantidadGenerada = (id) => {
    let suma = 0
    for (let index = 0; index < waste?.length; index++) {
      if (waste[index].id.includes(id)) {
        console.log(waste[index].id);
        console.log(waste[index].cantidadGenerada);
        suma += parseFloat(waste[index].cantidadGenerada)
      }
    }
    // const array = statements[index].residuos
    // for (let i = 0; i < array.length; i++) {
    //   suma += parseInt(array[i].cantidadGenerada)
    // }
    return suma;
  }

  const columns = [
    { field: "id", headerName: props.name, width: 90 },
    { field: "shippingDate", headerName: "Fecha de envío", width: 170 },
    { field: "stage", headerName: "Etapa", width: 135 },
    { field: "generador", headerName: "Generador", width: 170 },
    { field: "place", headerName: "Espacio", width: 210 },
    { field: "waste", headerName: "Cant. residuos", width: 110 },
    {
      field: "containersQuantity",
      headerName: "Cant. generada (kg)",
      width: 140,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 110,
      renderCell: (params) => <ContextMenuCell params={params} />,
    },
  ];

  const columnsGenerador = [
    { field: "id", headerName: props.name, width: 90 },
    { field: "shippingDate", headerName: "Fecha de envío", width: 170 },
    { field: "stage", headerName: "Etapa", width: 135 },
    { field: "place", headerName: "Espacio", width: 210 },
    { field: "waste", headerName: "Cant. residuos", width: 110 },
    {
      field: "containersQuantity",
      headerName: "Cant. generada (kg)",
      width: 140,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 110,
      renderCell: (params) => <ContextMenuCell params={params} />,
    },
  ];

  const rows = statements.filter(dato => {
    const laboratorio = laboratorios.find((lab) => lab.id === dato.id_laboratorio)
    const cumple = (
      laboratorio && `${laboratorio?.nombreLaboratorio} ${laboratorio?.espacioFisico} ${laboratorio?.facultad}`.toLowerCase().includes(searchStatement.toLowerCase())
    )
    return cumple
  }).map((item, index) => {
    const lab = laboratorios.find((lab) => lab.id === item.id_laboratorio)
    const generador = usuarioRegistrados.find(g => g.id === item.id_generador)
    const rowGenerador = {
      id: item.id,
      shippingDate: `${new Date(item.fecha_creacion.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(item.fecha_creacion.seconds * 1000).toLocaleTimeString()}`,
      stage: item.etapa == 1 ? "Agenda verificación" : item.etapa == 2 ? "Verificación" : item.etapa == 3 ? "Agenda recepción" : item.etapa == 4 ? "Recepción" : "Finalizada",
      place: lab?.nombreLaboratorio + " - " + lab?.ubicacionFisica + " - " + lab?.facultad,
      waste: item.residuos.length,
      containersQuantity: sumaCantidadGenerada(item.id),
    }
    
    const row = {
      id: item.id,
      shippingDate: `${new Date(item.fecha_creacion.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(item.fecha_creacion.seconds * 1000).toLocaleTimeString()}`,
      stage: item.etapa == 1 ? "Agenda verificación" : item.etapa == 2 ? "Verificación" : item.etapa == 3 ? "Agenda recepción" : item.etapa == 4 ? "Recepción" : "Finalizada",
      generador: `${generador?.nombre} ${generador?.apellidos}`,
      place: lab?.nombreLaboratorio + " - " + lab?.ubicacionFisica + " - " + lab?.facultad,
      waste: item.residuos.length,
      containersQuantity: sumaCantidadGenerada(item.id),
    }
    
    return usere.rol === "Generador"? rowGenerador:row
  }).sort()

  return (
    <Container sx={{ my: 3 }}>
      <Card elevation={5}>
        <CardHeader title="Declaraciones" sx={{ textAlign: "center" }} />
        <CardContent>
          <Grid container sx={{ justifyContent: usere.rol == "Generador" ? "space-between" : "right" }}>
            {usere.rol == "Generador" && <Grid item md={2} sx={{ flexGrow: 1 }}>
              <CustomTooltip title="Crear declaración" placement="right-start">
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
              </CustomTooltip>
            </Grid>}
            <Grid item md={4}>
              <Paper
                component="form"
                sx={{ p: "2px 4px", display: "flex", alignItems: "center", mb: 2 }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Buscar declaración"
                  inputProps={{ "aria-label": "search google maps" }}
                  value={searchStatement}
                  onChange={handleSearchStatement}
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
          {!statements && <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="error" />
          </Box>}
          {statements && statements?.length != 0 && <Box sx={{ overflowX: "hidden", maxHeight: "420px" }}>
            {rows != 0? (<DataGrid
              rows={rows}
              columns={usere.rol === "Generador"? columnsGenerador:columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 7 },
                },
              }}
              rowsPerPageOptions={[5,10]}
              disableRowSelectionOnClick
              editMode={false}
            />):(
              <Box sx={{ display: "flex", justifyContent: "center", mb: 5, mt: 0, border: 1, borderRadius: 1, borderColor: "lightgrey", py: 4 }}>
              <Typography variant="h5" sx={{ color: "grey" }}>No se encontraron coincidencias</Typography>
            </Box>
            )}
          </Box>}
          {statements && statements?.length == 0 &&
            <Box sx={{ display: "flex", justifyContent: "center", mb: 5, mt: 0, border: 1, borderRadius: 1, borderColor: "lightgrey", py: 4 }}>
              <Typography variant="h5" sx={{ color: "grey" }}>No hay declaraciones</Typography>
            </Box>
          }
        </CardContent>
      </Card>
      <Dialog open={open} onClose={() => handleClose()} fullScreen sx={{ mx: { xs: 4, md: 20 }, my: { xs: 4, md: 10 } }}>
        <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => handleClose()}>X</Button>
        <DialogTitle sx={{ textAlign: "center" }}>
          Registro de declaraciones
        </DialogTitle>
        <DialogContent>
          <CreateStatementForm closeDialog={handleClose} setAlert={setAlert} />
        </DialogContent>
      </Dialog>
      <Dialog open={openStatement} onClose={() => handleCloseStatement()} fullScreen sx={{ mx: { xs: 4, md: 20 }, my: { xs: 4, md: 10 } }}>
        <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => handleCloseStatement()}>X</Button>
        <DialogTitle sx={{ textAlign: "center" }}>
          Declaracion de residuos
        </DialogTitle>
        <DialogContent>
          <StatementInfo info={itemSelected} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} sx={{ mx: { xs: 4, md: 20 }, my: { xs: 4, md: 10 } }}>
        <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => setOpenDelete(false)}>X</Button>
        <DialogTitle sx={{ textAlign: "center" }}>
        ¿Estás seguro?
        </DialogTitle>
        <DialogContent>
            <Grid container justifyContent={"space-between"}>
              <Grid item md={5} xs={12}>
                <Button variant="contained" color="error" sx={{width:"100%"}} onClick={()=> deleteSt()}>Aceptar</Button>
              </Grid>
              <Grid item md={5} xs={12}>
                <Button variant="contained" color="inherit" sx={{width:"100%"}} onClick={()=>setOpenDelete(false)}>Cancelar</Button>
              </Grid>
            </Grid>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={alert.state}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setAlert({ state: false, message: '', error: false })}
      >
        <Alert
          severity={alert.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StatementsList;
