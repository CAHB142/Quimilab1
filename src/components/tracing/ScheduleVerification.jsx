import React, { useState } from 'react'
import { Box, TextField, Grid, Button, Alert, Snackbar, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import { useAuthTracing } from '../../hooks/AuthContextTracing';
import ApiCalendar from 'react-google-calendar-api';
import GoogleButton from 'react-google-button';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth as useAuthUsuarios } from '../../hooks/AuthContextUsuarios';
// import { google } from 'googleapis';

export function ScheduleVerification({ etapa, declaracion, setOpenStatement, setAlert, generarExcelJS, selectedStatements, setSelectedStatements, statementsByEtapaSchedule }) {

  const [horaSeleccionada, setHoraSeleccionada] = useState("")
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const { updateFechaVerificacion, updateFechaRecepcion, revisionesResiduos, pruebaRecepcion } = useAuthTracing()
  const { user, usuarioRegistrados } = useAuthUsuarios()
  const [accessToken, setAccessToken] = useState()
  const [hd, setHd] = useState()
  const [error, setError] = useState({})
  const [stateHora, setStateHora] = useState(true)
  const tomorrow = dayjs()
  const minTime = dayjs().set('hour', new Date().getHours()).startOf('hour');
  const config = {
    clientId: "203256198737-e7p8jfp2gtt2hrqn5nrdh9skiovgnfk7.apps.googleusercontent.com",
    apiKey: "AIzaSyAscMsNutKvbbCibVdg1YnrUUaDXTDpOGQ",
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
  };

  const apiCalendar = new ApiCalendar(config);
  const calendarId = 'c_63dc24ebee164e8c8ca60f573b22ce1a724580e8f7a31e58015d2446dd078296@group.calendar.google.com';
  const sendUpdates = 'all';

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ state: false, error: false, message: '' })
  };

  const updateStatement = () => {
    const fechaVR = new Date(fechaSeleccionada);
    fechaVR.setHours(horaSeleccionada.hour())
    fechaVR.setMinutes(horaSeleccionada.minute())
    fechaVR.setSeconds(horaSeleccionada.second())
    fechaVR.setMilliseconds(horaSeleccionada.millisecond())

    etapa == 1 ? updateFechaVerificacion(declaracion.id, 2, fechaVR)
      : updateFechaRecepcion(declaracion.id, 4, fechaVR)
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      setHd(tokenResponse.hd)
      if (tokenResponse.hd !== "correounivalle.edu.co") {
        setAlert({ state: true, error: true, message: 'Este usuario no tiene permitido realizar esta acción, debe ser un correo institucional' })
      }
      console.log(tokenResponse)
    },
    // onError: (error) => {
    //   console.log(error);
    // },
    scope: "https://www.googleapis.com/auth/calendar",
  })

  const validate = () => {
    const errors = {}
    const today = new Date()
    const fecha = new Date(fechaSeleccionada)
    
    if (horaSeleccionada) {
      fecha.setHours(horaSeleccionada.hour())
      fecha.setMinutes(horaSeleccionada.minute())
      fecha.setSeconds(horaSeleccionada.second())
      fecha.setMilliseconds(horaSeleccionada.millisecond())
    }

    if (fecha.getDate() === NaN || fecha.getMonth() === NaN || fecha.getFullYear() === NaN || fechaSeleccionada === '') {
      errors['fechaSeleccionada'] = 'Campo obligatorio'
    }
    if (fecha.getDate() < today.getDate() || fecha.getMonth() < today.getMonth() || fecha.getFullYear() < today.getFullYear()) {
      errors['fechaSeleccionada'] = 'Ingrese una fecha válida'
    }
    if (horaSeleccionada === '') {
      errors['horaSeleccionada'] = 'Campo obligatorio'
    }
    // if (fecha.getHours() < today.getHours()) {
    //   if (fecha.getMinutes() < today.getMinutes()) errors['horaSeleccionada'] = 'Ingrese una hora válida'
    // }

    return errors
  }

  const createEventCalendar = () => {
    console.log(selectedStatements);
    const val = validate()
    setError(val)
    if (Object.keys(val).length === 0) {
      const emails = selectedStatements.map(st => ({ email: usuarioRegistrados.find(us => us.id === st.id_generador)?.email }))
      const email = [{ email: user?.email }]
      let eventList = []
      // const attendees = etapa==2?email:emails
      //[{email:"nicolas.pineda@correounivalle.edu.co"}, {email: "carlos.brinez@correounivalle.edu.co"}]
      // console.log("EMAILS", attendees);
      if (hd === "correounivalle.edu.co") {
        if (fechaSeleccionada != "" && horaSeleccionada != "") {
          const fechaVR = new Date(fechaSeleccionada);
          console.log("FECHAVRRR\n", fechaVR);
          fechaVR.setHours(horaSeleccionada.hour())
          fechaVR.setMinutes(horaSeleccionada.minute())
          fechaVR.setSeconds(horaSeleccionada.second())
          fechaVR.setMilliseconds(horaSeleccionada.millisecond())
          const fechaVR1 = new Date(fechaVR);
          fechaVR1.setHours(fechaVR1.getHours() + 1)
          
          if (etapa == 1) {
            const event = {
              summary: "Verificación de declaración",
              start: {
                dateTime: fechaVR.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
              end: {
                dateTime: fechaVR1.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
              attendees: email,
              colorId: "11",
            }

            apiCalendar.createEvent(event, calendarId, sendUpdates)
              .then(res => {
                console.log(res)
                updateFechaVerificacion(declaracion.id, 2, fechaVR, res.result.id)
                //updateFechaRecepcion(declaracion.id, 4, fechaVR, res.result.id)
                //generarExcelJS(fechaVR)
                setAlert({ state: true, error: false, message: 'Visita agendada con exito' })
                setOpenStatement(false)
              })
          } else {
            emails.map((e, index) => {
              const event = {
                summary: "Recepción de residuos",
                start: {
                  dateTime: fechaVR.toISOString(),
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                  dateTime: fechaVR1.toISOString(),
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                attendees: [e],
                colorId: "11",
              }

              apiCalendar.createEvent(event, calendarId, sendUpdates)
                .then(res => {
                  console.log(res)
                  // const array = [...selectedStatements]
                  // array[index] = {...selectedStatements[index], idEvent: res.result.id}
                  // setSelectedStatements([...array])
                  //updateFechaRecepcion(declaracion.id, 4, fechaVR, res.result.id)
                  //generarExcelJS(fechaVR)
                  pruebaRecepcion(selectedStatements[index], fechaVR, etapa, res.result.id)
                })
            })

            generarExcelJS(fechaVR)
            setAlert({ state: true, error: false, message: 'Recepción agendada con exito' })
            setOpenStatement(false)
          }
        } else {
          setAlert({ state: true, error: true, message: 'Todos los campos son obligatorios' })
        }
      } else {
        setAlert({ state: true, error: true, message: 'Este usuario no tiene permitido realizar esta acción, debe ser un correo institucional' })
        console.log("Este usuario no tiene permitido realizar esta acción");
      }
    } else {
      setAlert({ state: true, message: 'Todos los campos son obligatorios', error: true })
    }

    //apiCalendar.listUpcomingEvents(maxResults, calendarId).then(res => console.log("EVENTOSSS\n",res))
  }

  const del = () => {
    apiCalendar.listUpcomingEvents(10)
      .then(res => {
        console.log(res.result.items)
      })
  }

  return (
    <Box sx={{ mx: 2 }} >
      <div className='contenedorS'>
        {accessToken && hd === "correounivalle.edu.co" && (
          <>
            <Grid container>
              <Grid item xs={12}   >
                <Box  >
                  <div align="center"><h3>{etapa == 1 ? "Agenda de Verificacion" : etapa == 3 ? "Agenda de Recepción" : ""}</h3> </div>
                  <br />
                  <div className='grupo1' >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div align="center"><span> Fecha :</span> </div>
                      <div align='center'>
                        <DatePicker
                          value={fechaSeleccionada}
                          disablePast
                          minDate={tomorrow}
                          onChange={(newValue) => {
                            setFechaSeleccionada(newValue);
                            // if (newValue !== '') {
                            //   setStateHora(false)
                            // }
                            console.log(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              disabled
                              label='kn,n,n,'
                            // Otros atributos según tus necesidades
                            />
                          )} />
                      </div>
                    </LocalizationProvider>
                    {error.fechaSeleccionada && <Typography style={{ color: "red", fontSize: "14px", mb: 2 }}>{error.fechaSeleccionada}</Typography>}
                  </div>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Grid container>
              <Grid item xs={12} >
                <Box >
                  <div className='grupo2' >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div align='center'><span>Hora:</span></div>
                      <div align='center'>
                        <TimePicker
                          value={horaSeleccionada}
                          disablePast
                          minTime={minTime}
                          onChange={(newValue) => {
                            setHoraSeleccionada(newValue);
                            console.log(newValue);
                          }}
                        />
                      </div>
                    </LocalizationProvider>
                    {error.horaSeleccionada && <Typography style={{ color: "red", fontSize: "14px", mb: 2 }}>{error.horaSeleccionada}</Typography>}
                  </div>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ margin: 5 }}>
              <div align="center">
                <Button variant="contained" onClick={createEventCalendar}>Agendar</Button>
              </div>
            </Box>
          </>
        )}
        {accessToken && hd !== "correounivalle.edu.co" && <Grid container sx={{ mb: 5, display: "flex", justifyContent: "center" }}>
          <Grid item md={12} sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: "bold", fontSize: 25 }}>Intenta de nuevo con un correo institucional</Typography>
          </Grid>
          <Grid item md={12} sx={{ display: "flex", justifyContent: "center" }}>
            <GoogleButton label='Accede con Google' onClick={() => login()} />
          </Grid>
        </Grid>}
        {!accessToken && hd !== "correounivalle.edu.co" && <Box sx={{ margin: 3 }}>
          <div align="center">
            <GoogleButton label='Autenticarse con Google' onClick={() => login()} />
          </div>
        </Box>}
      </div>
    </Box>
  )
}

export default ScheduleVerification;






