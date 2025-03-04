import { Button, Checkbox, Container, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuthStatement } from '../../hooks/AuthContextStatements';
import { logDOM } from '@testing-library/react';

const VerificationReceptionForm = ({ setOpenStatement, revisiones, setRevisiones, info, revSelected, statementInfo, setStatementInfo, setAlert }) => {

    const destinos = ['Tratamiento externo', 'Tratamiento interno']
    const tratamientos = ['Celda', 'Incineración', 'Físico-químico']
    const [tratamiento, setTratamiento] = useState(revisiones[revSelected]? revisiones[revSelected].tratamiento : "");
    const [destino, setDestino] = useState(revisiones[revSelected]? revisiones[revSelected].destino : "");
    const [corriente_, setCorriente_] = useState(revisiones[revSelected]? revisiones[revSelected].corriente : info?.corriente)
    const { corrientes } = useAuthStatement()
    const [cantidadGenerada, setCantidadGenerada] = useState(revisiones[revSelected]? revisiones[revSelected].cantidadGenerada: info?.cantidadGenerada)
    const [comentarioRevision, setComentarios] = useState(revisiones[revSelected]? revisiones[revSelected].comentario_revision:"");
    const [comentarioRecepcion, setComentariosRecepcion] = useState(revisiones[revSelected]? revisiones[revSelected].comentario_recepcion:"");
    const [checked, setChecked] = useState(revisiones[revSelected]?.revisado? revisiones[revSelected].revisado : false);
    const [checked1, setChecked1] = useState(revisiones[revSelected]?.recibido? revisiones[revSelected].recibido : false);
    const [error, setError] = useState({
        cantidadGenerada: false,
        destino: false,
        tratamiento: false,
        corriente: false,
        comentarioRevision: false,
        comentarioRecepcion: false,
        revisado: false,
        recibido: false
      });
    
    useEffect(() => {
      console.log(info);
      console.log(statementInfo);
      console.log("REVI",revisiones);
    }, [])
    
    const handleChecked = ({ target: { checked } }) => {
        setChecked(checked);
        console.log(typeof(checked));
    };

    const handleChecked1 = ({ target: { checked } }) => {
        setChecked1(checked);
        console.log(typeof(checked));
      };

      const validate = () => {
        const excludedProperty = "descripcion";
        const errors = {}
        
        const requiredFields = [cantidadGenerada, destino, corriente_, checked];
        const requiredFields2 = [cantidadGenerada, destino, corriente_, checked1];
        const requiredFieldsKeys = ['cantidadGenerada', 'destino', 'corriente_', 'revisado'];
        const requiredFieldsKeys2 = ['cantidadGenerada', 'destino', 'corriente_', 'recibido'];
        console.log(requiredFields);
        console.log(statementInfo.etapa);
        if(statementInfo.etapa === 2){
            requiredFields.forEach((field, index) => {
                if (field === "" || field === false) {
                    errors[requiredFieldsKeys[index]] = requiredFieldsKeys[index] === 'revisado'?'Debe marcar la casilla':`Campo obligatorio`;
                    console.log("este campo ****");
                }
            });
        }else{
            requiredFields2.forEach((field, index) => {
                if (field === "" || field === false) {
                    errors[requiredFieldsKeys2[index]] = requiredFieldsKeys2[index] === 'recibido'?'Debe marcar la casilla':`Campo obligatorio`;
                    console.log("este campo ****");
                }
            });
        }
        if(destino === "Tratamiento externo"){
            if(tratamiento == ""){
                errors['tratamiento'] = `Campo obligatorio`;
            }
        }
        const reg = /^\d+\.\d{1,2}$/
        if (!reg.test(cantidadGenerada)) {
            errors['cantidadGenerada'] = "Datos inválidos. Debe usar este formato 0.00, ejemplo: 1.5"
        }
        if (cantidadGenerada <= 0) {
            errors['cantidadGenerada'] = "Debe ser mayor a 0"
        }
        return errors
      };
      
    const addRevision = () => {
        const val = validate()
        setError(val)

        if(Object.keys(val).length === 0){
            console.log("ADD REVISON", statementInfo.etapa);
            const rev = {
                idDeclaracion: info.id_declaracion,
                idResiduo: `${info.id_declaracion}${revSelected}`,
                cantidadGenerada: cantidadGenerada,
                destino: destino,
                tratamiento: tratamiento,
                corriente: corriente_,
                comentario_revision: comentarioRevision,
                comentario_recepcion: comentarioRecepcion,
                fechaRevision: new Date(),
                revisado: Boolean(checked),
                recibido: Boolean(checked1)
            }
    
            const updatedStatementInfo = {...statementInfo}
            statementInfo.residuos[revSelected].cantidadGenerada = cantidadGenerada
            statementInfo.residuos[revSelected].corriente = corriente_
            setStatementInfo(updatedStatementInfo) 
            console.log("tipo: " + typeof(rev.revisado))
            let arr = [...revisiones]
            // arr.push(rev)
            arr[revSelected] = rev
            setRevisiones(arr)
            setAlert({state: true, message: "Guardado con éxito", error:false})
            setOpenStatement(false)
        }else{
            console.log(val);
        }
    }

    return (
        <Container sx={{ px: 4, pt:1 }}>
            <Grid container>
                <Grid item md={12} sx={{ mb:2 }}>
                    <TextField 
                        label="Cantidad generada(kg)" 
                        id="cantidadGenerada" 
                        value={cantidadGenerada} 
                        onChange={(e) => {
                            const re = /^(0*[1-9]\d*(\.\d+)?)$/
                            const regex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
                            const reg = /^\d+\.\d{1,2}$/
                            setError({...error, cantidadGenerada:null})
                            if (reg.test(e.target.value)) {
                              console.log(e.target.value);
                              console.log(typeof(e.target.value));
                              setCantidadGenerada(e.target.value)
                            }else{
                                setCantidadGenerada(e.target.value)
                             setError({...error, cantidadGenerada:"Datos inválidos. Debe usar este formato 0.00, ejemplo: 1.5"})
                            }
                          }} 
                        fullWidth 
                    />
                    {error.cantidadGenerada && <Typography style={{color:"red", fontSize:"14px", mb:2}}>{error.cantidadGenerada}</Typography>}  
                </Grid>
                <Grid item md={12} sx={{ mb:2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="destino">Destino</InputLabel>
                        <Select
                            labelId="destino"
                            id="destino-select"
                            value={destino}
                            label="destino"
                            onChange={(event) => {
                                setDestino(event.target.value)
                                if(event.target.value === "Tratamiento interno"){
                                    setTratamiento('')
                                }
                            }}
                        >
                            {destinos.map((item, index) => (
                                <MenuItem id={item} value={item}>{item}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    {error.destino && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.destino}</Typography>}  
                </Grid>
                {destino === "Tratamiento externo" && 
                    <Grid item md={12} sx={{ mb: 2 }}>
                    <FormControl fullWidth >
                        <InputLabel id="tratamientos">Tratamientos</InputLabel>
                        <Select
                            labelId="tratamientos"
                            id="tratamientos-select"
                            value={tratamiento}
                            label="tratamientos"
                            onChange={(event) => setTratamiento(event.target.value)}
                        >
                            {tratamientos.map((item, index) => (
                                <MenuItem id={item} value={item}>{item}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    {error.tratamiento && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.tratamiento}</Typography>}  
                </Grid>
                }
                <Grid item md={12} sx={{ mb: 2 }}>
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Corriente</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={corriente_}
                            label="Corriente"
                            onChange={(event) => setCorriente_(event.target.value)}
                        >
                            {corrientes.map((item, index) => (
                                <MenuItem id={item.id} value={item.id}>{item.clasificacionBasilea}  {item.clasfres11642002} - {item.proceso} - {item.descripcionProceso}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    {error.corriente && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.corriente}</Typography>}  
                </Grid>
                <Grid item md={12} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        disabled={statementInfo.etapa == 4?true:false}
                        id="comentarioRevision"
                        name="comentarioRevision"
                        label="Comentario de revisión"
                        multiline
                        rows={5}
                        value={comentarioRevision}
                        onChange={(event) => setComentarios(event.target.value)}
                    />
                    {error.comentarioRevision && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.comentarioRevision}</Typography>}  
                </Grid>
                {statementInfo.etapa == 4 && <Grid item md={12} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        id="comentarioRecepcion"
                        name="comentarioRecepcion"
                        label="Comentario de recepción"
                        multiline
                        rows={5}
                        value={comentarioRecepcion}
                        onChange={(event) => setComentariosRecepcion(event.target.value)}
                    />
                    {error.comentarioRecepcion && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.comentarioRecepcion}</Typography>}  
                </Grid>}
                <Grid item md={12} sx={{ mb: 2 }}>
                    {statementInfo.etapa == 2 && <>
                        <FormControlLabel control={<Checkbox checked={checked} onChange={handleChecked}/>} label="Revisado" />
                    {error.revisado && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.revisado}</Typography>}
                    </>}
                    {statementInfo.etapa == 4 && <>
                        <FormControlLabel control={<Checkbox checked={checked1} onChange={handleChecked1}/>} label="Recibido" />
                    {error.recibido && <Typography style={{color:"red", fontSize:"14px", mt:3}}>{error.recibido}</Typography>}
                    </>}
                </Grid>
                <Divider sx={{width:"100%", mb: 4 }}></Divider>
                <Grid item md={12} sx={{ display: "flex", justifyContent: "space-evenly" }}>
                    <Button variant='contained' color='success' sx={{ width: "30%", p: 1 }} onClick={() => addRevision()}>Guardar</Button>
                    <Button variant='contained' color='inherit' sx={{ width: "30%", p: 1 }} onClick={() => { setOpenStatement(false); console.log(revisiones) }}>Cerrar</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default VerificationReceptionForm

// const validate= (values)=> {
//     const errors = {}
//     const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
//     const regexCas = /^\d{2,7}-\d{2}-\d{1}$/;
    
//     if(!values.Nombre){
//       errors.Nombre = "El campo nombre es requerido"
//     }else if(!regexName.test(values.Nombre)){
//       errors.Nombre = "El campo nombre sólo acepta letras y espacios en blanco"
//     }if(!values.Sinonimos){
//       errors.Sinonimos = "El campo sinónimos es requerido"
//     }else if(!regexName.test(values.Sinonimos)){
//       errors.Sinonimos = "El campo sinónimos sólo acepta letras y espacios en blanco"
//     }if(!values.NombreIn){
//       errors.NombreIn = "El campo nombre en inglés es requerido"
//     }else if(!regexName.test(values.NombreIn)){
//       errors.NombreIn = "El campo nombre en inglés sólo acepta letras y espacios en blanco"
//     }if(!values.Cas){
//       errors.Cas = "El campo número CAS es requerido"
//     }else if(!regexCas.test(values.Cas)){
//       errors.Cas = "El campo solo acepta el formato xxxxxxx-xx-x"
//     }if(!values.EstadoFi){
//       errors.EstadoFi = "El campo estado fisico es requerido"
//     }if(!values.Cantidad){
//       errors.Cantidad = "El campo Cantidad es requerido"
//     }

//     return errors;
//   };