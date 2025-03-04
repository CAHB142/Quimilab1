import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Container,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  Box,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { DataGrid, gridColumnLookupSelector } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuthReactivos } from "../../hooks/AuthContextReactivos";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuthStatement } from "../../hooks/AuthContextStatements";
import { useAuthPruebas } from "../../hooks/AuthContextPruebas";

const CreateWasteForm = ({ stateForm, addWaste, updateWaste, action, wasteToUpdate, setWasteToUpdate, setAlert }) => {
  const { reactivos } = useAuthReactivos();
  const { getCorrientes, corrientes } = useAuthStatement();
  const { pruebas } = useAuthPruebas()
  const [wasteReactivos, setWasteReactivos] = useState([])
  const [waste, setWaste] = useState({
    nombre: wasteToUpdate.object ? wasteToUpdate.object.nombre : "",
    corriente: wasteToUpdate.object ? wasteToUpdate.object.corriente : "",
    reactivos: wasteToUpdate.object ? wasteToUpdate.object.reactivos : [],
    cantidadGenerada: wasteToUpdate.object ? wasteToUpdate.object.cantidadGenerada : 0,
    unidades: wasteToUpdate.object ? wasteToUpdate.object.unidades : "",
    tipoEmbalaje: wasteToUpdate.object ? wasteToUpdate.object.tipoEmbalaje : "",
    material: wasteToUpdate.object ? wasteToUpdate.object.material : "",
    descripcion: wasteToUpdate.object ? wasteToUpdate.object.descripcion : "",
    estadoFQ: wasteToUpdate.object ? wasteToUpdate.object.estadoFQ : "",
    inflamable: wasteToUpdate?.object.inflamable ? wasteToUpdate.object.inflamable : false,
    prueba: wasteToUpdate?.object ? wasteToUpdate.object.prueba : ""
  });
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {
    getCorrientes()
  }, [])

  const handleChecked = ({ target: { checked } }) => {
    console.log(waste);
    setWaste({ ...waste, inflamable: Boolean(checked) });
  };

  const handleChange = ({ target: { name, value, id, option } }, r = 0) => {
    console.log("id: " + id)
    console.log("name: " + r)
    console.log(r)
    // if (id && id.includes("reactivos-option-")) {
    //   let newArray = [...waste.reactivos]
    //   newArray.push(r)
    //   setWaste({ ...waste, reactivos: newArray.pop() })
    // } else {
    setWaste({ ...waste, [name]: value });
    //}
    console.log(wasteReactivos)
    console.log(waste.reactivos)

  };

  const handleDelete = (reactivo) => {
    const reactivos_ = (array) =>
      array.filter((item) => item.uid !== reactivo.uid);
    setWaste({ ...waste, reactivos: reactivos_ });
    console.log("eliminadooooo");
  };

  const [error, setError] = useState({
    nombre: false,
    corriente: false,
    reactivos: false,
    cantidadGenerada: false,
    unidades: false,
    tipoEmbalaje: false,
    material: false,
    descripcion: false,
    estadoFQ: false,
    inflamable: false,
    prueba: false
  });

  const handleBlur = () => {
    if (waste.nombre == "") setError(!error);
    else setError(false);
  };

  const validate = () => {
    const excludedProperty = "descripcion";
    const errors = {}

    const requiredFields = ['nombre', 'prueba', 'corriente', 'unidades', 'cantidadGenerada', 'tipoEmbalaje', 'material', 'estadoFQ'];

    requiredFields.forEach(field => {
      if (waste[field] === "") {
        errors[field] = `Campo obligatorio`;
      }
    });

    if (waste['cantidadGenerada'] <= 0) {
      errors['cantidadGenerada'] = `Debe ser mayor a 0`;
    }
    if (waste.reactivos.length === 0) {
      errors['reactivos'] = `Campo obligatorio`;
    }
    const reg = /^\d+\.\d{1,2}$/
    if (!reg.test(waste['cantidadGenerada'])) {
      errors['cantidadGenerada'] = "Datos inválidos. Debe usar este formato 0.00, ejemplo: 1.5"
    }
    if (waste['unidades'] <= 0) {
      errors['unidades'] = `Debe ser mayor a 0`;
    }
    return errors
  };

  const handleSubmit = () => {
    const val = validate()
    setError(val)
    if (Object.keys(val).length === 0) {
      console.log("Waste Form\n", waste);
      if (action === "crear") addWaste(waste);
      else updateWaste(waste, wasteToUpdate.index)
    } else {
      setAlert({ state: true, message: "Falta información requerida", error: true })
    }
  };

  const clearForm = () => {
    setWaste({
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
    })
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
  }

  const type = "number";

  return (
    <Container>
      <Grid container sx={{}} spacing={1}>
        <Grid item xs={12} md={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Características
          </Typography>
        </Grid>
        <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
        <Grid item xs={12} md={5} sx={{ my: 2 }}>
          <TextField
            required
            name="nombre"
            label="Nombre"
            placeholder="Nombre"
            value={waste.nombre}
            onChange={handleChange}
            fullWidth
          />
          {error.nombre && <Typography style={{ color: "red", fontSize: "14px" }}>{error.nombre}</Typography>}
        </Grid>
        <Grid item xs={12} md={5} sx={{ my: 2 }}>
          <FormControl fullWidth required>
            <InputLabel
              id="label-select-prueba"
            >
              Prueba o ensayo
            </InputLabel>
            <Select
              required
              labelId="label-select-prueba"
              name="prueba"
              label="Prueba o ensayo"
              value={waste.prueba}
              onChange={handleChange}
            >
              {pruebas.map((item, index) => (
                <MenuItem value={item}>{item.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {error.prueba && <Typography style={{ color: "red", fontSize: "14px" }}>{error.prueba}</Typography>}
        </Grid>
        <Grid item xs={12} md={5} sx={{ my: 2 }}>
          <FormControl fullWidth required>
            <InputLabel
              id="label-select-corriente"
              helperText={"Decreto 4741 Y/A"}
            >
              Corriente (Decreto 4741 Y/A)
            </InputLabel>
            <Select
              required
              labelId="label-select-corriente"
              name="corriente"
              label="Corriente (Decreto 4741 Y/A)"
              helperText={"Decreto 4741 Y/A"}
              value={waste.corriente}
              onChange={handleChange}
            >
              {corrientes.map((item, index) => (
                <MenuItem value={item.id}>{item.clasificacionBasilea} - {item.clasfRes11642002} - {item.proceso} - {item.descripcionProceso}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {error.corriente && <Typography style={{ color: "red", fontSize: "14px" }}>{error.corriente}</Typography>}
        </Grid>
        <Grid item xs={12} md={7} sx={{ my: 2 }}>
          <Autocomplete
            fullWidth
            multiple
            id="reactivos"
            onChange={
              (e, newValue) => { setWaste({ ...waste, reactivos: newValue }) }
            }
            options={reactivos}
            //defaultValue={waste.reactivos}
            value={waste.reactivos}
            getOptionLabel={(option) => option.Nombre}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Reactivos"
              />
            )}
          />
          {error.reactivos && <Typography style={{ color: "red", fontSize: "14px" }}>{error.reactivos}</Typography>}
        </Grid>
        <Grid item xs={12} md={4} sx={{ my: 2 }}>
          <TextField
            required
            name="cantidadGenerada"
            label="Cantidad generada (kg)"
            placeholder=""
            defaultValue={0}
            value={waste.cantidadGenerada}
            onChange={(e) => {
              const re = /^(0*[1-9]\d*(\.\d+)?)$/
              const regex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
              const reg = /^\d+\.\d{1,2}$/
              setError({ ...error, cantidadGenerada: null })
              if (reg.test(e.target.value)) {
                console.log(e.target.value);
                console.log(typeof (e.target.value));
                setWaste({ ...waste, cantidadGenerada: e.target.value })
              } else {
                setWaste({ ...waste, cantidadGenerada: e.target.value })
                setError({ ...error, cantidadGenerada: "Datos inválidos. Debe usar este formato 0.00, ejemplo: 1.5" })
              }
            }}
          />
          {error.cantidadGenerada && <Typography style={{ color: "red", fontSize: "14px" }}>{error.cantidadGenerada}</Typography>}
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Embalaje del residuo
          </Typography>
        </Grid>
        <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
        <Grid item xs={12} md={3} sx={{ my: 2 }}>
          <TextField
            required
            type="number"
            name="unidades"
            label="Unidades"
            placeholder=""
            value={waste.unidades}
            onChange={(e) => {
              const regex = /^[1-9]\d*$/;
              setError({ ...error, unidades: null })
              if (regex.test(e.target.value)) {
                console.log(e.target.value);
                console.log(typeof (e.target.value));
                setWaste({ ...waste, unidades: e.target.value })
              } else {
                setWaste({ ...waste, unidades: e.target.value })
                setError({ ...error, unidades: "Debe ser mayor a 0" })
              }
            }}
          />
          {error.unidades && <Typography style={{ color: "red", fontSize: "14px" }}>{error.unidades}</Typography>}
        </Grid>
        <Grid item xs={12} md={4} sx={{ my: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="select-recipient-label">
              Tipo de embalaje
            </InputLabel>
            <Select
              required
              labelId="select-recipient-label"
              id="tipoEmbalaje"
              name="tipoEmbalaje"
              label="Tipo de recipiente"
              value={waste.tipoEmbalaje}
              onChange={handleChange}
            >
              <MenuItem value={"Caneca o tambor"}>Caneca o tambor</MenuItem>
              <MenuItem value={"Bolsa"}>Bolsa</MenuItem>
              <MenuItem value={"Big Bag"}>Big Bag</MenuItem>
              <MenuItem value={"Isotanque"}>Isotanque</MenuItem>
              <MenuItem value={"Caja"}>Caja</MenuItem>
              <MenuItem value={"Granel"}>Granel</MenuItem>
              <MenuItem value={"Guardian"}>Guardian</MenuItem>
            </Select>
          </FormControl>
          {error.tipoEmbalaje && <Typography style={{ color: "red", fontSize: "14px" }}>{error.tipoEmbalaje}</Typography>}
        </Grid>
        <Grid item xs={12} md={4} sx={{ my: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="select-material-label">
              Material
            </InputLabel>
            <Select
              required
              labelId="select-material-label"
              id="material"
              name="material"
              label="Material"
              value={waste.material}
              onChange={handleChange}
            >
              <MenuItem value={"Metalica"}>Metalica</MenuItem>
              <MenuItem value={"Plastica"}>Plastica</MenuItem>
              <MenuItem value={"Lona"}>Lona</MenuItem>
              <MenuItem value={"Carton"}>Carton</MenuItem>
              <MenuItem value={"Madera"}>Madera</MenuItem>
              <MenuItem value={"Papel"}>Papel</MenuItem>
              <MenuItem value={"Vidrio"}>Vidrio</MenuItem>
            </Select>
          </FormControl>
          {error.material && <Typography style={{ color: "red", fontSize: "14px" }}>{error.material}</Typography>}
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Características Fisicoquímicas
          </Typography>
        </Grid>
        <Divider sx={{ width: "100%", mt: 2, bgcolor: "black" }} />
        <Grid item xs={12} md={4} sx={{ my: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="select-state-label">
              Estado fisicoquímico
            </InputLabel>
            <Select
              required
              labelId="select-state-label"
              id="estadoFQ"
              name="estadoFQ"
              label="Estado fisicoquímico"
              value={waste.estadoFQ}
              onChange={handleChange}
            >
              <MenuItem value={"Sólido"}>Sólido</MenuItem>
              <MenuItem value={"Líquido"}>Líquido</MenuItem>
              <MenuItem value={"Gaseoso"}>Gaseoso</MenuItem>
            </Select>
          </FormControl>
          {error.estadoFQ && <Typography style={{ color: "red", fontSize: "14px" }}>{error.estadoFQ}</Typography>}
        </Grid>
        <Grid item xs={12} md={4} sx={{ my: 2, mx: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={waste.inflamable} onChange={handleChecked} />}
            name="inflamable"
            id="inflamable"
            label="Es inflamable?"
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ my: 2 }}>
          <TextField
            fullWidth
            id="descripcion"
            name="descripcion"
            label="Observaciones"
            multiline
            rows={5}
            value={waste.descripcion}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 1, textAlign: "center" }}>
          <Box sx={{}}>
            <IconButton
              variant="outlined"
              color="success"
              size="medium"
              sx={{ mx: 1 }}
              onClick={() => { handleSubmit() }}
            >
              <CheckIcon fontSize="large" />
            </IconButton>
            <IconButton
              sx={{ color: "red", mx: 1 }}
              size="medium"
              onClick={() => { clearForm(); stateForm() }}
            >
              <ClearIcon fontSize="large" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateWasteForm;

{/* <FormControl fullWidth required>
            <InputLabel id="label-select-reactivos" helperText={"Reactivos"}>Reactivos</InputLabel>
            <Select
              required
              labelId="label-select-reactivos"
              id="rectivos"
              name="reactivos"
              label="Reactivos"
              helperText={"Reactivos usados"}
              multiple
              value={waste.reactivos}
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value, index) => (
                    <Chip 
                      key={value.uid} 
                      label={value} 
                      clickable
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      onDelete={()=>{handleDelete(value)}}/>
                  ))}
                </Box>
              )}
            >
              {reactivos.map(item => (
              <MenuItem value={item.Nombre}>{item.Nombre}</MenuItem>
              ))}
            </Select>
          </FormControl> */}