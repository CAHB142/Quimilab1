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
    dialogClasses
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import StatementInfo from "../Statements/StatementInfo";
import { useState } from "react";
import { useAuthStatement } from "../../hooks/AuthContextStatements"
import { ScheduleVerification } from "./ScheduleVerification";
import { useAuthLaboratorio } from "../../hooks/AuthContextLaboratorios";
import { useAuth as useAuthUsuarios } from "../../hooks/AuthContextUsuarios";
import VerificationRecepcion from "./VerificationReception";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { utils, writeFile } from "xlsx";
import ApiCalendar from 'react-google-calendar-api';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthTracing } from "../../hooks/AuthContextTracing";
const ExcelJS = require('exceljs');

const ListByEtapa = ({ etapa }) => {
    const { statements, statementsByEtapa, waste, corrientes } = useAuthStatement();
    const { revisionesResiduos, recepcionesResiduos, cancelarEvento, pruebaRecepcion, multipleReception } = useAuthTracing()
    const { laboratorios } = useAuthLaboratorio()
    const { getUserById, usuarioRegistrados } = useAuthUsuarios()
    //const [anchorEl, setAnchorEl] = useState(null);
    //const openMenu = Boolean(anchorEl);
    const [open, setOpen] = useState(false);
    const [openStatement, setOpenStatement] = useState(false)
    const [itemSelected, setItemSelected] = useState(null)
    const [cantidad, setCantidad] = useState(0)
    const [searchStatement, setSearchStatement] = useState("")
    const [actionDialog, setActionDialog] = useState()
    const [alertVer, setAlertVer] = useState({ state: false, message: '' })
    const [alert, setAlert] = useState({ state: false, error: false, message: '' })
    const [accessToken, setAccessToken] = useState()
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedStatements, setSelectedStatements] = useState([])

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

    useEffect(() => {
        verificationDay()
        console.log("New listByEtapa");
    }, [statementsByEtapa])

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertVer({ state: false, message: '' });
    };

    const verificationDay = () => {
        for (let index = 0; index < statements?.length; index++) {
            if (new Date().getDate() == new Date(statements[index]?.fecha_verificacion?.seconds * 1000).getDate() && statements[index]?.etapa == 2) {
                setAlertVer({ state: true, message: 'Atención! Hoy es día de verificación. Por favor revisa.' })
            }
            else if (new Date().getDate() == new Date(statements[index]?.fecha_recepcion?.seconds * 1000).getDate() && statements[index]?.etapa == 4) {
                setAlertVer({ state: true, message: 'Atención! Hoy es día de recepción. Por favor revisa.' })
            }
        }
    }


    const openDialogStatement = (action) => {
        console.log(itemSelected)
        if (action == "ver") {
            getUserById(itemSelected.id_generador)
            setActionDialog(action)
            setOpenStatement(true);
        } else if (action == "agendarV") {
            getUserById(itemSelected.id_generador)
            setActionDialog(action)
            setOpenStatement(true);
        } else if (action == "revisar") {
            getUserById(itemSelected.id_generador)
            setActionDialog(action)
            setOpenStatement(true);
        } else if (action == "agendarR") {
            if (selectedRows.length == 0) {
                setAlert({ state: true, message: 'Debe seleccionar al menos una declaración', error: true })
            } else {
                const sel = selectedRows.map(row => statementsByEtapa.find(st => st.id === row))
                console.log("SEEEEL", sel);
                setSelectedStatements(sel)
                setActionDialog(action)
                setOpenStatement(true);
            }
        } else if (action == "recibir") {
            getUserById(itemSelected.id_generador)
            setActionDialog(action)
            setOpenStatement(true);
        }
    };

    const validateVerificationReceptionDay = () => {
        const today = new Date()
        console.log("Fecha:", new Date(itemSelected.fecha_verificacion?.seconds * 1000).getTime(), today.getTime());
        if (etapa == 2) {
            // new Date(itemSelected.fecha_verificacion).getDate() != today.getDate()
            //     && new Date(itemSelected.fecha_verificacion).getHours() != today.getHours()
            //     && new Date(itemSelected.fecha_verificacion).getMinutes() != today.getMinutes()
            if (new Date(itemSelected.fecha_verificacion?.seconds * 1000).getTime() > today.getTime()) {
                window.alert(`La verificación se habilita el ${new Date(itemSelected.fecha_verificacion?.seconds * 1000).toLocaleDateString("en-US")} a las ${new Date(itemSelected.fecha_verificacion?.seconds * 1000).toLocaleTimeString()}`)
            } else {
                openDialogStatement("revisar")
            }
        } else {
            // new Date(itemSelected.fecha_recepcion).getDate() != today.getDate()
            //     && new Date(itemSelected.fecha_recepcion).getHours() != today.getHours()
            //     && new Date(itemSelected.fecha_recepcion).getMinutes() != today.getMinutes()
            if (new Date(itemSelected.fecha_recepcion?.seconds * 1000).getTime() > today.getTime()) {
                window.alert(`La verificación se habilita el ${new Date(itemSelected.fecha_recepcion?.seconds * 1000).toLocaleDateString("en-US")} a las ${new Date(itemSelected.fecha_recepcion?.seconds * 1000).toLocaleTimeString()}`)
            } else {
                openDialogStatement("recibir")
            }
        }
    }

    const handleCloseStatement = () => {
        setOpenStatement(false);
    };

    const handleSearchStatement = (event) => {
        setSearchStatement(event.target.value)
        console.log(event.target.value)
    }

    const sumaCantidadGenerada = (id) => {
        // let suma = 0
        // for (let index = 0; index < waste?.length; index++) {
        //     if (waste[index].id.includes(id)) {
        //         console.log(waste[index].id);
        //         console.log(waste[index].cantidadGenerada);
        //         suma += parseFloat(waste[index].cantidadGenerada)
        //     }
        // }
        // // const array = statements[index].residuos
        // // for (let i = 0; i < array.length; i++) {
        // //   suma += parseInt(array[i].cantidadGenerada)
        // // }
        // return suma;
        const suma = waste
            ?.filter((item) => item.id.includes(id))
            .reduce((accumulator, currentItem) => accumulator + parseFloat(currentItem.cantidadGenerada), 0);

        return suma || 0;
    }

    const wasteStatement = (id) => {
        let reactivo = ''
        for (let index = 0; index < waste?.length; index++) {
            if (waste[index].id.includes(id)) {
                console.log(waste[index].id);
                console.log(waste[index].cantidadGenerada);
                reactivo += `${waste[index].reactivos[0].Nombre},`
            }
        }
        // const array = statements[index].residuos
        // for (let i = 0; i < array.length; i++) {
        //   suma += parseInt(array[i].cantidadGenerada)
        // }
        return reactivo;
    }

    const reactives = (id) => {
        let string = '';
        const wasteItem = waste.find((item) => item.id.includes(id));
        if (wasteItem) {
            wasteItem.reactivos.forEach(element => {
                string += element.Nombre + ", "
            });
            string = string.slice(0, string.lastIndexOf(","));
            return string;
        }
        return '';
    }

    const corriente_ = (id) => {
        const itemEncontrado = corrientes?.find(cor => cor.id === id);
        if (itemEncontrado) {
            const res = `${itemEncontrado?.clasificacionBasilea} - ${itemEncontrado?.clasfRes11642002} - ${itemEncontrado?.proceso} - ${itemEncontrado?.descripcionProceso}`;
            return res
        } else {
            return "No existe"
        }
    }

    const generarPDF = () => {
        console.log(itemSelected);
        const head = ['#', 'Nombre', 'reactivos', 'cant. generada (kg)', 'Unidades'];
        const lab = laboratorios.find(lab => lab.id === itemSelected.id_laboratorio)
        const userDec = usuarioRegistrados.find(u => u.id === itemSelected.id_generador)
        //const head = Object.keys(statementsByEtapa[0]).filter(llave => llavesPermitidas.includes(llave));
        // const body = statementsByEtapa.map((item) => {
        //     const element = [
        //         `${item.etapa}`,
        //         `${new Date(item.fecha_creacion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(item.fecha_creacion?.seconds * 1000).toLocaleTimeString()}`,
        //         `${sumaCantidadGenerada(item.id)} kg`,
        //         `${wasteStatement(item.id)}`
        //     ]
        //     return element
        // })
        const body = itemSelected.residuos.map((item, index) => ([index+1, item.nombre, reactives(index), item.cantidadGenerada, item.unidades]))

        const doc = new jsPDF({
            orientation: 'landscape'
        })

        console.log("Fonts\n", doc.getFontList());
        // doc.html(html, {
        //     callback: function (doc) {
        //         doc.save();
        //     }
        // });

        doc.setFontSize(12);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text("Comprobante de finalización de declaración", 15, 15)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date().toLocaleDateString("en-US")}`, 250, 15)

        doc.setTextColor(100, 100, 100);
        doc.line(15, 20, 280, 20)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text("De", 15, 28)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0); // Cambiar el color de fuente a rojo (RGB)
        doc.text("Inventario de Residuos Químicos Peligrosos", 15, 33)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0); // Cambiar el color de fuente a rojo (RGB)
        doc.text("Sección de Servicios Varios", 15, 38)

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Edificio E1, espacio 2057, Sede Meléndez', 15, 43)

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Ext. 2237", 15, 48)

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Para", 105, 28)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${userDec.nombre} ${userDec.apellidos}`, 105, 33)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${lab.nombreLaboratorio}`, 105, 38)

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${userDec.email}`, 105, 43)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Declaración:`, 200, 28)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${itemSelected.id}`, 224, 28)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha declaración: `, 200, 33)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date(itemSelected.fecha_creacion?.seconds * 1000).toLocaleDateString("en-US")}`, 236, 33)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha verificación:`, 200, 38)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date(itemSelected.fecha_verificacion?.seconds * 1000).toLocaleDateString("en-US")}`, 236, 38)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha recepción:`, 200, 43)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date(itemSelected.fecha_recepcion?.seconds * 1000).toLocaleDateString("en-US")}`, 234, 43)

        doc.setFontSize(10);
        doc.setFont('Helvetica', 'Bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha finalización:`, 200, 49)

        doc.setFontSize(10);
        doc.setFont('Helvetica', '');
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date(itemSelected.fecha_finalizacion?.seconds * 1000).toLocaleDateString("en-US")}`, 234, 49)

        autoTable(doc, {
            headStyles: {
                fillColor: [100, 100, 100]
            },
            bodyStyles: {
                overflow: 'linebreak',
                cellWidth: 'wrap'
            },
            startY: 60,
            head: [head],
            body: body
        })
        doc.save(`Comprobante de entrea_declaración_${itemSelected.id}.pdf`)
    }

    const generarExcel = () => {
        const libro = utils.book_new()
        const hoja = utils.json_to_sheet(statementsByEtapa)
        utils.book_append_sheet(libro, hoja, "Declaraciones")
        utils.book_append_sheet(libro, hoja, "Declaraciones 2")
        writeFile(libro, "Declaraciones.xlsx")
    }

    const getUserStatement = (id) => {
        return usuarioRegistrados.find((user) => user.id === id)
    }

    const filtrarPorFacultad = (statementsArray) => {

        const agrupadasPorFacultad = [];

        statementsArray.forEach(st => {
            const { id_laboratorio } = st;
            const facultad = laboratorios.find((lab) => lab.id === id_laboratorio)?.facultad
            const facultades = []
            if (!agrupadasPorFacultad[facultad]) {
                agrupadasPorFacultad[facultad] = [];
            }

            agrupadasPorFacultad[facultad].push(st);
        });

        return agrupadasPorFacultad;

    }

    const generarExcelJS = (fechaRecepcion) => {
        const statetementsByFacultad = filtrarPorFacultad(selectedStatements)
        const facultades = Object.keys(statetementsByFacultad)
        const workbook_writeBuffer = []

        if (selectedStatements.length == 0) {
            setAlert({ state: true, message: "Debe seleccionar al menos una declaración", error: true })
        } else {
            for (let i = 0; i < facultades.length; i++) {
                const workbook = new ExcelJS.Workbook()
                statetementsByFacultad[facultades[i]].map((item, index) => {
                    const lab = laboratorios.find((lab) => lab.id === item.id_laboratorio)
                    console.log(facultades[i] + "\n", item);
                    const userSt = getUserStatement(item.id_generador)
                    const sheet = workbook.addWorksheet("Declaración  #" + (index + 1))
                    sheet.columns = [
                        {
                            header: "No",
                            key: 'id',
                            width: 9.6,
                            // style:{
                            //     alignment:{horizontal:"center"}
                            // }
                        },
                        {
                            header: "NOMBRE DEL RESIDUO",
                            key: 'nombre',
                            width: 45.56,
                        },
                        {
                            header: "CORRIENTE (DECRETO 4741 Y/A)",
                            key: 'corriente',
                            width: 12.11
                        },
                        {
                            header: "CANTIDAD GENERADA (Kg)",
                            key: 'cantidadGenerada',
                            width: 11.78,
                        },
                        {
                            header: "UNIDADES",
                            key: 'unidades',
                            width: 10.78
                        },
                        {
                            header: "TIPO DE EMBALAJE",
                            key: 'tipoEmbalaje',
                            width: 10.78
                        },
                        {
                            header: "MATERIAL",
                            key: 'material',
                            width: 10.78
                        },
                        {
                            header: "ESTADO FISICOQUÍMICO",
                            key: 'estadoFQ',
                            width: 35.33
                        },
                        {
                            header: "INFLAMABLE SI/NO",
                            key: 'inflamable',
                            width: 12.33
                        },
                        {
                            header: "OBSERVACIONES",
                            key: 'observaciones',
                            width: 29.78
                        },
                    ]

                    for (let index = 1; index < 8; index++) {
                        sheet.insertRow(index).alignment = { vertical: "middle", horizontal: "center" }
                        sheet.getRow(index).height = 20.40
                        sheet.getRow(index).font = {
                            name: 'Calibri',
                            color: { argb: '00000000' },
                            family: 2,
                            size: 11,
                            bold: true,
                        };
                        // sheet.getRow(index).border = {
                        //     top: {style:'thin'},
                        //     left: {style:'thin'},
                        //     bottom: {style:'thin'},
                        //     right: {style:'thin'}
                        //   };
                    }

                    for (let index = 3; index < 7; index++) {
                        sheet.mergeCells(`A${index}`, `B${index}`);
                        sheet.mergeCells(`C${index}`, `G${index}`);
                    }

                    sheet.mergeCells('A1', 'J1');
                    sheet.getCell("A1").value = "FORMATO DE DECLARACIÓN DE RESIDUOS QUÍMICOS"
                    sheet.getRow(1).font = {
                        name: 'Calibri',
                        color: { argb: '00000000' },
                        family: 2,
                        size: 16,
                        bold: true,
                    };

                    sheet.mergeCells('A2', 'J2');
                    sheet.getCell("A2").value = "GESTIÓN INTEGRAL DE RESIDUOS PELIGROSOS UNIVERSIDAD DEL VALLE"
                    sheet.mergeCells('A7', 'A8')
                    sheet.mergeCells('B7', 'D7')
                    sheet.mergeCells('E7:G7')
                    sheet.mergeCells('H3', 'H4')
                    sheet.mergeCells('H5', 'H6')
                    sheet.mergeCells('I3', 'J4')
                    sheet.mergeCells('I5', 'J6')
                    sheet.mergeCells('H7', 'I7')
                    sheet.getCell("A3").value = "UNIDAD GENERADORA"
                    sheet.getCell('C3').value = lab?.nombreLaboratorio
                    sheet.getCell("A4").value = "RESPONSABLE"
                    sheet.getCell("C4").value = `${userSt.nombre} ${userSt.apellidos}`
                    sheet.getCell("A5").value = "NOMBRE RESPONSABLE ENTREGA"
                    sheet.getCell("C5").value = item.responsableEntrega
                    sheet.getCell("A6").value = "CARGO"
                    sheet.getCell("C6").value = `${userSt.cargo}`
                    sheet.getCell('A7').value = "No"
                    sheet.getCell('B7').value = "CARACTERÍSTICAS"
                    sheet.getCell('E7').value = "EMBALAJE DEL RESIDUO"
                    sheet.getCell('H7').value = "CARACTERÍSTICAS FISICOQUÍMICAS"
                    sheet.getCell('H3').value = "UBICACIÓN"
                    sheet.getCell('I3').value = lab?.ubicacionFisica
                    sheet.getCell('H5').value = "FECHA"
                    sheet.getCell('I5').value = new Date(item.fecha_creacion?.seconds * 1000).toLocaleDateString("en-US")
                    sheet.getRow(1).height = 91.60
                    sheet.getRow(7).height = 20.40
                    sheet.getRow(8).height = 43.20 + 11
                    sheet.getColumn("A", "J").alignment = { vertical: "middle", horizontal: "center" }
                    const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
                    cols.forEach(element => {
                        sheet.getColumn(element).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                    sheet.getRow(8).alignment = { vertical: "middle", horizontal: "center", wrapText: true }
                    sheet.getRow(8).font = { bold: true }

                    waste?.filter(w => w.id.includes(item.id)).map((w, index) => {
                        sheet.addRow({
                            id: index,
                            // fecha_creacion: new Date(item.fecha_creacion?.seconds * 1000).toLocaleDateString("en-US"),
                            // etapa: item.etapa
                            nombre: w.nombre,
                            corriente: corriente_(w.corriente),
                            cantidadGenerada: parseFloat(w.cantidadGenerada),
                            unidades: parseInt(w.unidades),
                            tipoEmbalaje: w.tipoEmbalaje,
                            material: w.material,
                            estadoFQ: w.estadoFQ,
                            inflamable: w.inflamable ? "Si" : "No",
                            observaciones: w.descripcion
                        })
                    })
                })

                workbook.xlsx.writeBuffer().then(data => {
                    //workbook_writeBuffer.push(data)
                    console.log(data);
                    const blob = new Blob([data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
                    })
                    const url = window.URL.createObjectURL(blob)
                    const anchor = document.createElement('a')
                    anchor.href = url
                    anchor.download = `Declaraciones ${facultades[i]}.xlsx`
                    anchor.click()
                    window.URL.revokeObjectURL(url)
                })
            }
            // console.log(eventList);
            // // const eventsStatements = selectedStatements.map((st, index) => ({...st, idEvent: eventIds[index]}))
            // const eventsStatements = selectedStatements.map((st, index) => {
            //     console.log(`Index: ${index}, Statement: ${st}, EventId: ${eventList[index]}`);
            //     return { ...st, idEvent: eventList[index].idEvent};
            // });
            // console.log("eventsStatements", eventsStatements);
            console.log(selectedStatements);
            setSelectedRows([])
            // for (let i = 0; i < workbook_writeBuffer.length; i++) {
            //     console.log(data);
            //     const blob = new Blob([data], {
            //         type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
            //     })
            //     const url = window.URL.createObjectURL(blob)
            //     const anchor = document.createElement('a')
            //     anchor.href = url
            //     anchor.download = `Declaraciones ${facultades[index]}.xlsx`
            //     anchor.click()
            //     window.URL.revokeObjectURL(url)
            // }
            // workbook_writeBuffer.map((data, index) => {
            //     console.log(data);
            //     const blob = new Blob([data], {
            //         type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
            //     })
            //     const url = window.URL.createObjectURL(blob)
            //     const anchor = document.createElement('a')
            //     anchor.href = url
            //     anchor.download = `Declaraciones ${facultades[index]}.xlsx`
            //     anchor.click()
            //     window.URL.revokeObjectURL(url)
            // })
            // sheet.mergeCells('A1', 'J1');
            // sheet.getRow({horizontal:"center"})
        }

    }

    const loginDelete = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
            deleteEventCalendar(tokenResponse.access_token)
            console.log(tokenResponse)
        },
        scope: "https://www.googleapis.com/auth/calendar",
    })

    const deleteEventCalendar = async (token) => {
        console.log(revisionesResiduos);
        apiCalendar.listUpcomingEvents(10, calendarId).then(res => {
            console.log(res);
        })
        console.log(token)
        //await login()
        if (token) {
            console.log("ENTRE")
            let idEvent = ''
            let id = ''
            if (etapa == 2) {
                for (let index = 0; index < revisionesResiduos?.length; index++) {
                    if (revisionesResiduos[index].id_declaracion.includes(itemSelected.id)) {
                        idEvent = revisionesResiduos[index].id_event_verificacion
                        id = revisionesResiduos[index].id
                    }
                }
            } else {
                for (let index = 0; index < recepcionesResiduos?.length; index++) {
                    if (recepcionesResiduos[index].id_declaracion.includes(itemSelected.id)) {
                        idEvent = recepcionesResiduos[index].id_event_verificacion
                        id = recepcionesResiduos[index].id
                    }
                }
            }

            console.log("ID\n", idEvent);
            apiCalendar.deleteEvent(idEvent, calendarId, sendUpdates).then(res => {
                cancelarEvento(itemSelected.id, id, etapa, idEvent)
                setAlert({ state: true, error: false, message: etapa == 2? "Verificación cancelada": "Recepción cancelada" })
            })
        }
    }

    const recibirResiduos = () => {
        if (selectedRows.length != 0) {
            const sel = selectedRows.map(row => statementsByEtapa.find(st => st.id === row))
            const verDay = sel.filter(s => new Date(s.fecha_recepcion?.seconds * 1000).getDate() > new Date().getDate())
            if (verDay.length > 0) {
                setAlert({ state: true, message: 'Una o más declaraciones no están programadas para hoy', error: true })
            } else {
                multipleReception(sel)
                setAlert({ state: true, message: 'Recepción exitosa', error: false })
            }
            // let res = []

            // for (let i = 0; i < sel.length; i++) {
            //     for (let j = 0; j < sel[i].residuos.length; j++) {
            //         res.push({id: sel[i].residuos[j].id}) 
            //     }
            // }
            // console.log("recibir residuos\n", res);
        } else {
            setAlert({ state: true, message: 'Debe seleccionar al menos una declaración', error: true })
        }
    }

    const columns = [
        { field: "id", headerName: "id", width: 90 },
        {
            field: "date",
            headerName: etapa == 1 ? "Fecha de envío" : etapa == 2 ? "Fecha verificación" : etapa == 3 ? "Fecha verificación" : etapa == 4 ? "Fecha recepción" : "Fecha de finalización",
            width: 180
        },
        { field: "place", headerName: "Espacio", width: 215 },
        { field: "generador", headerName: "Generador", width: 170 },
        { field: "waste", headerName: "Cant. residuos", width: 120 },
        {
            field: "containersQuantity",
            headerName: "Cant. generada (kg)",
            width: 150,
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 130,
            renderCell: (params) => <ContextMenuCell params={params} />,
        },
    ];

    const rows = statementsByEtapa?.filter(dato => {
        const laboratorio = laboratorios.find((lab) => lab.id === dato.id_laboratorio)
        const cumple = (
            laboratorio && `${laboratorio?.nombreLaboratorio} ${laboratorio?.espacioFisico} ${laboratorio?.facultad}`.toLowerCase().includes(searchStatement.toLowerCase())
        )
        return cumple
    }).map((item, index) => {
        const lab = laboratorios.find((lab) => lab.id === item.id_laboratorio)
        const generador = usuarioRegistrados.find(g => g.id === item.id_generador)
        return {
            id: item.id,
            date: etapa == 1 && item.fecha_creacion ?
                `${new Date(item.fecha_creacion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(item.fecha_creacion?.seconds * 1000).toLocaleTimeString()}`
                : etapa == 2 || etapa == 3 && item.fecha_verificacion ? `${new Date(item.fecha_verificacion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(item.fecha_verificacion?.seconds * 1000).toLocaleTimeString()}`
                    : `${new Date(item.fecha_recepcion?.seconds * 1000).toLocaleDateString("en-US")} - ${new Date(item.fecha_recepcion?.seconds * 1000).toLocaleTimeString()}`,
            generador: `${generador?.nombre} ${generador?.apellidos}`,
            place: lab?.nombreLaboratorio + " - " + lab?.ubicacionFisica + " - " + lab?.facultad,
            waste: item.residuos.length,
            containersQuantity: sumaCantidadGenerada(item.id),
        }
    }).sort()


    const ContextMenuCell = ({ params }) => {
        console.log(params.row);
        const [anchorEl, setAnchorEl] = useState(null);
        const openMenu = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
            setItemSelected(statementsByEtapa.find(st => st.id === params.row.id));
            console.log(statementsByEtapa[params.row.id]);
            console.log(revisionesResiduos);
            // wasteItemSelected(statementsByEtapa[params.row.id].id)
        };

        const handleCloseM = () => {
            setAnchorEl(null);
        };

        const handleMenuItemClick = () => {
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
                    {etapa == 1 && <MenuItem onClick={() => { openDialogStatement("ver") }}>Ver</MenuItem>}
                    {etapa == 1 && <MenuItem onClick={() => { openDialogStatement("agendarV") }}>Agendar visita</MenuItem>}
                    {etapa == 2 && <MenuItem onClick={() => { validateVerificationReceptionDay() }}>Verificar</MenuItem>}
                    {etapa == 2 && <MenuItem onClick={() => { loginDelete() }}>Cancelar</MenuItem>}
                    {etapa == 3 && <MenuItem onClick={() => { openDialogStatement("ver") }}>Ver</MenuItem>}
                    {/* {etapa == 3 && <MenuItem onClick={() => { openDialogStatement("agendarR") }}>Agendar recepción</MenuItem>} */}
                    {etapa == 4 && <MenuItem onClick={() => { validateVerificationReceptionDay() }}>Recibir</MenuItem>}
                    {etapa == 4 && <MenuItem onClick={() => { loginDelete() }}>Cancelar</MenuItem>}
                    {etapa == 5 && <MenuItem onClick={() => { openDialogStatement("ver") }}>Ver</MenuItem>}
                    {etapa == 5 && <MenuItem onClick={() => generarPDF()}>Comprobante de entrega</MenuItem>}
                    {/* {props.action == "agendarR" && <MenuItem onClick={openDialogStatement}>AgendarR</MenuItem>} */}
                    {/* <MenuItem onClick={async ()=> {await deleteStatement(itemSelected); handleCloseM();}}>Eliminar</MenuItem> */}
                </Menu>
            </>
        );
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <Container sx={{ my: 3 }}>
            {alertVer.state && <Alert sx={{ mb: 3 }} severity="info" onClose={() => { handleCloseAlert() }} color="warning">{alertVer.message}</Alert>}
            <Card elevation={5} sx={{ minHeight: "300px" }}>
                <CardHeader title={"Declaraciones"} sx={{ textAlign: "center" }} />
                <CardContent>
                    {statementsByEtapa && statementsByEtapa?.length != 0 &&
                        <Grid container sx={{ justifyContent: "right", mb: 2 }}>
                            <Grid item md={4} >
                                <Paper
                                    component="form"
                                    sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
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
                        </Grid>}
                    {!statementsByEtapa && <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress color="error" />
                    </Box>}
                    {statementsByEtapa && statementsByEtapa.length !== 0 && (<DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 7 },
                            },
                        }}
                        rowsPerPageOptions={[5, 10]}
                        disableRowSelectionOnClick
                        editMode={false}
                        checkboxSelection={etapa == 3 || etapa == 4}
                        onRowSelectionModelChange={(selection) => { setSelectedRows(selection); console.log(selectedRows); }}
                        rowSelectionModel={selectedRows}
                        hideFooterSelectedRowCount
                    />)}
                    {statementsByEtapa && statementsByEtapa.length == 0 &&
                        (<Box sx={{ display: "flex", justifyContent: "center", mb: 5, mt: 0, border: 1, borderRadius: 1, borderColor: "lightgrey", py: 4 }}>
                            <Typography variant="h5" sx={{ color: "grey" }}>No hay declaraciones en esta etapa</Typography>
                        </Box>)
                    }
                    {statementsByEtapa && statementsByEtapa.length !== 0 && etapa == 3 && (<Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => openDialogStatement("agendarR")}>Agendar recepción</Button>
                    </Box>)}
                    {statementsByEtapa && statementsByEtapa.length !== 0 && etapa == 4 && (<Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => recibirResiduos()}>Recibir</Button>
                    </Box>)}
                </CardContent>
            </Card>
            {/* (etapa == 1 || etapa == 3) */}
            <Dialog open={openStatement} onClose={() => handleCloseStatement()} fullScreen={(actionDialog == "agendarV" || actionDialog == "agendarR") ? false : true} sx={{ mx: { xs: 4, md: 20 }, my: { xs: 4, md: 10 } }}>
                <Button variant="text" style={{ marginLeft: "auto", width: "2px", color: "black", fontWeight: "bold" }} onClick={() => handleCloseStatement()}>X</Button>
                <DialogTitle sx={{ textAlign: "center" }}>
                    {(etapa == 1 || etapa == 3) && actionDialog == "ver" ? "Declaración de residuos" : etapa == 2 ? "Revisión de residuos" : etapa == 4 ? "Recepción de residuos" : ''}
                </DialogTitle>
                <DialogContent>
                    {etapa == 1 && actionDialog == "agendarV" && <ScheduleVerification setOpenStatement={setOpenStatement} etapa={1} declaracion={itemSelected} setAlert={setAlert} generarExcelJS={generarExcelJS} selectedStatements={selectedStatements} setSelectedStatements={setSelectedStatements} statementsByEtapaSchedule={statementsByEtapa} />}
                    {(etapa == 1 || etapa == 3 || etapa == 5) && actionDialog == "ver" && <StatementInfo info={itemSelected} />}
                    {etapa == 3 && actionDialog == "agendarR" && <ScheduleVerification setOpenStatement={setOpenStatement} etapa={3} declaracion={itemSelected} setAlert={setAlert} generarExcelJS={generarExcelJS} selectedStatements={selectedStatements} setSelectedStatements={setSelectedStatements} statementsByEtapaSchedule={statementsByEtapa} />}
                    {etapa == 2 && actionDialog == "revisar" && <VerificationRecepcion info={itemSelected} setOpenStatementProp={setOpenStatement} setAlert={setAlert} />}
                    {etapa == 4 && actionDialog == "recibir" && <VerificationRecepcion info={itemSelected} setOpenStatementProp={setOpenStatement} setAlert={setAlert} />}
                    {/* {etapa == 3 && actionDialog == "agendarR" && <VerificationRecepcion info={itemSelected} />} */}
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

export default ListByEtapa;
//<GoogleButton label='Accede con Google' onClick={() => login()} />