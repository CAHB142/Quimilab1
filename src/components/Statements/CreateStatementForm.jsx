import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateWasteForm from "./CreateWasteForm";
import { useAuthStatement } from "../../hooks/AuthContextStatements";
import { useAuth } from "../../context/AuthContext";
import { useAuth as useAuthUsuarios } from "../../hooks/AuthContextUsuarios";
import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";

const CreateStatementForm = ({ closeDialog, setAlert }) => {
  const { usere } = useAuth()
  const { addStatements, getStatements, getWaste, corrientes } = useAuthStatement()
  const { getData, laboratorios } = useAuthLaboratorio()
  const { user } = useAuthUsuarios()
  const [rowsWaste, setRowsWaste] = useState([
    {
      name: "Prueba 1",
      reactivo: "Reactivo 1",
    },
  ]);
  const [fechaCreacion, setFechaCreacion] = useState(dayjs());
  const [openWaste, setOpenWaste] = useState({
    state: false,
    action: "crear",
    title: "Nuevo residuo"
  });
  const [openAlert, setOpenAlert] = useState({ state: false, messgae: "", error: false });
  const [buttonState, setButtonState] = useState(false)
  const [statement, setStatement] = useState({
    idGenerador: usere.uid,
    nombreGenerador: usere.nombre + " " + usere.apellidos,
    emailGenerador: usere.email,
    cargoGenerador: usere.cargo,
    laboratorio: "",
    responsableEntrega: "",
    fechaCreacion: new Date(),
    fechaRevision: "",
    fechaRecepcion: "",
    residuos: [],
    // residuos: [{nombre: "mezcla", corriente: "tóxico"}],
  });
  const [wasteToUpdate, setWasteToUpdate] = useState({
    object: {
      nombre: "",
      corriente: "",
      reactivos: [],
      cantidadGenerada: "",
      unidades: "",
      tipoEmbalaje: "",
      material: "",
      descripcion: "",
      estadoFQ: "",
      inflamable: false,
      prueba: ""
    },
    index: ""
  })
  const [waste, setWaste] = useState([]);
  const [error, setError] = useState({});
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert({ ...openAlert, state: false, messgae: "", error: false });
  };
  const handleChange = ({ target: { name, value } }) => {
    setStatement({ ...statement, [name]: value });
  };

  const addWaste = (w) => {
    setWasteToUpdate({
      object: {
        nombre: "",
        corriente: "",
        reactivos: [],
        cantidadGenerada: "",
        unidades: "",
        tipoEmbalaje: "",
        material: "",
        descripcion: "",
        estadoFQ: "",
        inflamable: false,
        prueba: ""
      },
      index: ""
    })
    let newArray = [...statement.residuos]
    newArray.push(w)
    console.log("NEW ARRAY:\n", newArray);
    setStatement({ ...statement, residuos: newArray })
    setAlert({state:true, message:"Residuo añadido con éxito", error:false})
    console.log(waste)
    handleChangeOpenWaste("")

  };

  const updateWaste = (w, index) => {
    setWasteToUpdate({
      object: {
        nombre: "",
        corriente: "",
        reactivos: [],
        cantidadGenerada: "",
        unidades: "",
        tipoEmbalaje: "",
        material: "",
        descripcion: "",
        estadoFQ: "",
        inflamable: false,
        prueba: ""
      },
      index: ""
    })
    console.log(w)
    statement.residuos[index] = w
    setAlert({state:true, message:"Residuo actualizado con éxito", error:false})
    // setStatement({...statement, residuos: statement.residuos})
    setOpenWaste(!openWaste.state)
  }

  const handleChangeOpenWaste = (action) => {
    setOpenWaste({
      state: !openWaste.state,
      action: action,
      title: action === "crear" ? "Nuevo residuo" : "Editar residuo"
    });
    console.log(usere)
  };

  const validate = () => {
    const errors = {}
    if (statement.laboratorio == "") {
      errors.laboratorio = "Campo obligatorio"
    }
    if (statement.responsableEntrega == "") {
      errors.responsableEntrega = "Campo obligatorio"
    }
    if (statement.residuos.length == 0) {
      errors.waste = "Debe añadir al menos un residuo"
    }
    // if(Object.keys(error).length != 0){
    //   setOpenAlert({ ...openAlert, state: true, messgae:"Falta información requerida o existen datos inválidos", error: true });
    // }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(statement)
    const val = validate()
    setError(val)
    if (Object.keys(val).length === 0) {
      try {
        await addStatements(statement);
        setAlert({ state: true, message: "Declaración registrada con éxito", error: false })
        //setOpenAlert({ state: true, message: "Declaración registrada con exito", error: false });
        closeDialog()
        setStatement({
          idGenerador: usere.uid,
          nombreGenerador: usere.nombre + " " + usere.apellidos,
          emailGenerador: usere.email,
          cargoGenerador: usere.cargo,
          laboratorio: "",
          responsableEntrega: "",
          fechaCreacion: fechaCreacion,
          fechaRevision: "",
          fechaRecepcion: "",
          residuos: [],
        })
        setError({})
        //getStatements(usere.uid, usere.rol)

      } catch (error) {
        setAlert({ state: true, message: "Problemas con el registro", error: true });
        //setOpenAlert({ state: true, message: "Problemas con el registro", error: true });
      }
    } else {
      setAlert({ state: true, message: "Falta información requerida", error: true });
    }

  };

  const corriente_ = (id) => {
    const itemEncontrado = corrientes?.find(cor => cor.id === id);
    if (itemEncontrado) {
      const res = `${itemEncontrado?.clasificacionBasilea} - ${itemEncontrado?.clasfRes11642002}`;
      return res
    } else {
      return "No existe"
    }
  }

  const reactives = (index) => {
    console.log("AAAAAA AAAAA BBB");
    console.log(statement.residuos[index])
    let string = '';

    statement.residuos[index].reactivos.map(element => {
      string += element.Nombre + ", "
    });

    string = string.slice(0, string.lastIndexOf(","));
    return string;
  }

  const deleteWaste = (index) => {
    let newArray = [...statement.residuos]
    newArray.splice(index,1)
    setStatement({...statement, residuos: newArray})
    setAlert({ state: true, message: "Eliminado con éxito", error: false });
  }

  return (
    <Container sx={{ border: 1 }}>
      <Grid container sx={{ px: 3, pt: 3, pb: 1 }} spacing={1}>
        {/* <Grid item xs={12} md={4} sx={{ my: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaCreacion"
              label="Fecha de creación"
              value={statement.fechaCreacion}
              disabled
              onChange={(newValue) => {
                setFechaCreacion(newValue);
                handleChange();
                console.log(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid> */}
        <Grid item xs={12} md={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Información del generador</Typography>
        </Grid>
        <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Responsable</Typography>
          <Typography variant="body1">{statement.nombreGenerador}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Correo</Typography>
          <Typography variant="body1">{statement.emailGenerador}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Cargo</Typography>
          <Typography variant="body1">{statement.cargoGenerador}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="label-select-laboratorio" error={error.error}>Laboratorio</InputLabel>
            <Select
              labelId="label-select-laboratorio"
              name="laboratorio"
              label="Laboratorio"
              value={statement.laboratorio}
              onChange={handleChange}
              error={error.error}
              helperText={error.text}
            >
              {usere.rol == "Administrador" || usere.rol == "Operador" ?
                (
                  laboratorios.map((item, index) => (
                    <MenuItem value={item.id}>{item.nombreLaboratorio}</MenuItem>
                  ))
                ) : (
                  user.asigLaboratorios.map((item, index) => (
                    <MenuItem value={item.id}>{item.nombreLaboratorio}</MenuItem>
                  ))
                )
              }
            </Select>
          </FormControl>
          {error.laboratorio && <Typography sx={{ color: "red", fontSize: "14px" }}>{error.laboratorio}</Typography>}
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <TextField
            fullWidth
            required
            name="responsableEntrega"
            label="Responsable de entrega"
            value={statement.responsableEntrega}
            onChange={handleChange}
          />
          {error.responsableEntrega && <Typography sx={{ color: "red", fontSize: "14px" }}>{error.responsableEntrega}</Typography>}
        </Grid>
        <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
        <Grid item xs={12} md={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{openWaste.state ? openWaste.title : "Residuos"}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 1 }}>
          {!openWaste.state && (
            <Button variant="contained" color="error" onClick={() => handleChangeOpenWaste("crear")}>Añadir</Button>
          )}
        </Grid>
        {openWaste.state && <CreateWasteForm stateForm={handleChangeOpenWaste} addWaste={addWaste} updateWaste={updateWaste} action={openWaste.action} wasteToUpdate={wasteToUpdate} setWasteToUpdate={setWasteToUpdate} setAlert={setAlert}/>}
        {!openWaste.state && (<Grid item xs={12} md={12} sx={{ my: 1 }}>
          {error.waste && <Typography sx={{ color: "red", fontSize: "16px", mb: 2 }}>{error.waste}</Typography>}
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Componentes</TableCell>
                  <TableCell>Cant. generada (kg)</TableCell>
                  <TableCell>Corriente</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              {statement.residuos.length != 0 && <TableBody>
                {statement.residuos.map((item, index) => (
                  <TableRow
                    key={item.nombre}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.nombre}
                    </TableCell>
                    <TableCell>{reactives(index)}</TableCell>
                    <TableCell>{item.cantidadGenerada}</TableCell>
                    <TableCell>{corriente_(item.corriente)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "white",
                          color: "#FF0000",
                        }}
                        variant="contained"
                        onClick={()=>deleteWaste(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "white",
                        }}
                        variant="contained"
                        onClick={() => { setWasteToUpdate({ object: item, index: index }); handleChangeOpenWaste("editar"); console.log(item) }}
                      >
                        <EditIcon color="warning" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              }
            </Table>
          </TableContainer>
          {statement.residuos.length === 0 && <Box sx={{ display: "flex", justifyContent: "center" }}><Typography variant="h6" sx={{ my: 2 }}>Aún no hay residuos</Typography></Box>}
        </Grid>)}
        <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
        <Grid item xs={12} md={6} sx={{ my: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            color="error"
            sx={{ width: "30%" }}
            onClick={handleSubmit}
          >
            Crear
          </Button>
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 3, textAlign: "center" }}>
          <Button variant="contained" color="inherit" sx={{ width: "30%" }} onClick={()=>closeDialog()}>
            Cancelar
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openAlert.state}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleCloseAlert}
      >
        <Alert

          severity={openAlert.error ? "error" : "success"}
          sx={{ width: "100%", bgcolor: openAlert.error ? "red" : "green", color: "white" }}
        >
          {openAlert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateStatementForm;
