import { Box, Button, Card, Container, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Chart from 'chart.js/auto';
import { useAuthStatement } from '../../hooks/AuthContextStatements';
import { useAuthLaboratorio } from '../../hooks/AuthContextLaboratorios';
import { useAuth } from '../../context/AuthContext';
import OperatorReports from './OperatorReports';
import GeneratorReports from './GeneratorReports';

const Reports = () => {
    const { getStatements, getWaste, statements, waste } = useAuthStatement()
    const { getData, laboratorios } = useAuthLaboratorio()
    const { usere } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getWaste(),
                    getData(),
                    getStatements(usere.uid, usere.rol),
                ]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        console.log(laboratorios);
    }, [])

    const renderAllCharts = () => {
        console.clear()
        renderChartWasteByLab()
        renderChartWasteByFacultad()
        renderChartWasteByPeriod()
    }

    const sumaCantidadGenerada = (id, wasteArr) => {
        let suma = 0
        for (let index = 0; index < wasteArr?.length; index++) {
            if (wasteArr[index].laboratorio.includes(id)) {
                suma += parseFloat(wasteArr[index].cantidadGenerada)
            }
        }
        return suma;
    }

    const cantidadGeneradaPorFacultad = (facultad, wasteArr) => {
        let suma = 0
        for (let index = 0; index < wasteArr?.length; index++) {
            if (wasteArr[index].facultad === facultad) {
                suma += parseFloat(wasteArr[index].cantidadGenerada)
            }
        }
        return suma;
    }

    function sumarCantidadPorFacultad(arr) {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorFacultad = {};

        // Recorrer el array de personas
        arr.forEach((a) => {
            const { facultad, cantidadGenerada } = a;

            // Verificar si ya existe el nombre en el objeto
            if (sumaPorFacultad[facultad]) {
                // Si existe, sumar la edad
                sumaPorFacultad[facultad] += cantidadGenerada;
            } else {
                // Si no existe, crear una nueva entrada en el objeto
                sumaPorFacultad[facultad] = cantidadGenerada;
            }
        });

        return sumaPorFacultad;
    }

    function sumarCantidadPorPeriodo(arr) {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorPeriodo = {};

        // Recorrer el array de personas
        arr.forEach((a) => {
            const { fechaCreacion, cantidadGenerada } = a;
            const month = new Date(fechaCreacion?.seconds * 1000).getMonth()
            console.log(new Date(fechaCreacion?.seconds * 1000).toLocaleDateString('es-CO'));
            console.log(new Date(fechaCreacion?.seconds * 1000).getMonth());
            const cantidadFloat = parseFloat(cantidadGenerada)
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            // Verificar si ya existe el nombre en el objeto
            if (sumaPorPeriodo[meses[month]]) {
                // Si existe, sumar la edad
                sumaPorPeriodo[meses[month]] += parseFloat(cantidadFloat.toFixed(3));
            } else {
                // Si no existe, crear una nueva entrada en el objeto
                sumaPorPeriodo[meses[month]] = parseFloat(cantidadFloat.toFixed(3));
            }
        });

        return sumaPorPeriodo;
    }

    const renderChartWasteByLab = () => {
        console.log(waste, laboratorios, statements);
        const uniqueStatements = [...new Set(statements.map(st => st.id))]
        const uniqueLaboratorios = [...new Set(laboratorios.map(lab => lab.id))]
        const wasteByStatement = waste.map((w, index) => ({ ...w, laboratorio: statements.find(st => st.id == w.id_declaracion).id_laboratorio }))
        let labs = laboratorios.map(lab => ({ ...lab, cantidadGenerada: sumaCantidadGenerada(lab.id, wasteByStatement) }))
        const statementsByLab = statements.map((index) => statements.filter(st => st.id_laboratorio === uniqueLaboratorios[index]))
        // const wasteByStatement = waste.map((index) => waste.filter(waste => waste.id_declaracion === uniqueStatements[index]))
        const wasteByLab = wasteByStatement.map((w, index) => { wasteByStatement.filter(wst => wst.laboratorio === uniqueLaboratorios[index]) })

        console.log("Wastee", labs);
        console.log("stBylab:\n", wasteByStatement);

        const existingChart = Chart.getChart('chartWasteByLab');
        console.log(uniqueStatements);
        if (existingChart) {
            existingChart.destroy();
        }

        const labelsLabs = laboratorios.map(lab => lab.nombreLaboratorio)
        console.log(uniqueLaboratorios.map(m => wasteByStatement.filter(waste => waste.id_laboratorio === m).length));
        const data = {
            labels: labelsLabs,
            datasets: [
                {
                    data: uniqueLaboratorios.map(m => labs.find(lab => lab.id === m).cantidadGenerada),
                    hoverOffset: 4,
                },
            ]
        }

        const options = {
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
        new Chart('chartWasteByLab', { type: 'pie', data, options })
    }

    const renderChartWasteByFacultad = () => {

        const existingChart = Chart.getChart('chartWasteByFacultad');

        if (existingChart) {
            existingChart.destroy();
        }

        const uniqueStatements = [...new Set(statements.map(st => st.id))]
        const uniqueLaboratorios = [...new Set(laboratorios.map(lab => lab.id))]
        const uniqueFacultades = [...new Set(laboratorios.map(lab => lab.facultad))]
        const statementsByLab = statements.map((index) => statements.filter(st => st.id_laboratorio === uniqueLaboratorios[index]))
        // const wasteByStatement = waste.map((index) => waste.filter(waste => waste.id_declaracion === uniqueStatements[index]))
        const wasteByFacultad = waste.map((w, index) => ({ ...w, facultad: laboratorios.find(lab => lab.id == statements[index].id_laboratorio).facultad }))
        const cantidades = sumarCantidadPorFacultad(wasteByFacultad)
        console.log(cantidades);
        const newWasteByFacultad = Object.keys(cantidades).map((c, index) => ({ facultad: c, cantidadGenerada: cantidades[c] }))
        const wasteByStatement = waste.map((w, index) => ({ ...w, laboratorio: statements.find(st => st.id == w.id_declaracion).id_laboratorio }))
        let labs = laboratorios.map(lab => ({ ...lab, cantidadGenerada: sumaCantidadGenerada(lab.id, wasteByStatement) }))
        //const wasteByLab = wasteByStatement.map((w, index) => { wasteByStatement.filter(wst => wst.laboratorio === uniqueLaboratorios[index]) })

        //console.log("Wastee", wasteByLab);
        console.log("wasteByFacultad:\n", newWasteByFacultad);

        const labelsLabs = laboratorios.map(lab => lab.nombreLaboratorio)
        const data = {
            labels: uniqueFacultades,
            datasets: [
                {
                    label: 'Residuos(kg) por facultad',
                    data: uniqueFacultades.map(m => newWasteByFacultad.find(nw => nw.facultad === m)?.cantidadGenerada),
                    hoverOffset: 4,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                },
            ]
        }

        const options = {
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
        new Chart('chartWasteByFacultad', { type: 'bar', data, options })
    }

    const renderChartWasteByPeriod = () => {

        const existingChart = Chart.getChart('chartWasteByPeriod');

        if (existingChart) {
            existingChart.destroy();
        }

        const wasteByPeriod = waste.map((w, index) => ({ ...w, fechaCreacion: statements.find(st => st.id == w.id_declaracion).fecha_creacion }))
        const cantidades = sumarCantidadPorPeriodo(wasteByPeriod)
        const newWasteByPeriod = Object.keys(cantidades).map((c, index) => ({ mes: c, cantidadGenerada: cantidades[c] }))
        console.log("wasteByPeriod:\n", newWasteByPeriod);
        const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        const arrData = labels.map(mes => {
            const valorEncontrado = newWasteByPeriod.find(nw => nw.mes === mes)?.cantidadGenerada;
            const numeroAleatorio = 0 + Math.random() * 0.9;
            return valorEncontrado !== undefined ? valorEncontrado : numeroAleatorio;
        });

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Residuos(kg) por periodo',
                    data: arrData,
                    hoverOffset: 4,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1,
                    fill: true,
                },
            ]
        }

        const options = {
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
        new Chart('chartWasteByPeriod', { type: 'line', data, options })
    }

    return (
        <Box>
            {usere.rol == "Administrador" && <Box>
                {statements != 0 ? (<OperatorReports />) : (
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 5, mt: 0, border: 1, borderRadius: 1, borderColor: "lightgrey", py: 4 }}>
                        <Typography variant="h5" sx={{ color: "grey" }}>No hay información para mostrar</Typography>
                    </Box>
                )}
            </Box>}
            {usere.rol == "Operador" && <Box>
                {statements != 0 ? (<OperatorReports />) : (
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 5, mt: 0, border: 1, borderRadius: 1, borderColor: "lightgrey", py: 4 }}>
                        <Typography variant="h5" sx={{ color: "grey" }}>No hay información para mostrar</Typography>
                    </Box>)}
            </Box>}
            {usere.rol == "Generador" && <Box>
                {statements != 0 ? (<GeneratorReports />) : (
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 5, mt: 0, border: 1, borderRadius: 1, borderColor: "lightgrey", py: 4 }}>
                        <Typography variant="h5" sx={{ color: "grey" }}>No hay información para mostrar</Typography>
                    </Box>)}
            </Box>}
        </Box>
    )
}

export default Reports