import { Box, Button, Card, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto';
import { useAuthStatement } from '../../hooks/AuthContextStatements';
import { useAuthLaboratorio } from '../../hooks/AuthContextLaboratorios';
import { useAuth } from '../../context/AuthContext';

const OperatorReports = () => {
    const { getStatements, getWaste, statements, waste } = useAuthStatement()
    const { getData, laboratorios } = useAuthLaboratorio()
    const { usere } = useAuth()
    const [year, setYear] = useState(new Date().getFullYear())
    const [filtro, setFiltro] = useState("Mes")
    const years = [...new Set(statements.map(st => new Date(st.fecha_creacion?.seconds * 1000).getFullYear()))]
    const filtros = [{ label: 'Meses', value: 'Mes' }, { label: "Semestres", value: "Semestre" }, { label: "Años", value: "Year" }]
    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "rgba(0,0,0,0.8)",
            color: 'white',
            fontSize: 16,
        },
    }));
    useEffect(() => {
        renderAllCharts()
    }, [])

    const handleChange = (event) => {
        setYear(event.target.value);
        console.log(event.target.value);
        renderChartWasteByPeriod(filtro, event.target.value)
    };

    const handleChangeFiltro = (event) => {
        setFiltro(event.target.value);
        console.log(event.target.value);
        renderChartWasteByPeriod(event.target.value, year)
    };

    const renderAllCharts = () => {
        console.clear()
        renderChartWasteByLab()
        renderChartWasteByFacultad()
        renderChartWasteByPeriod(filtro, year)
        renderChartStatementsByLab()
        renderChartWasteByDestiny()
    }

    const sumaCantidadGenerada = (id, wasteArr) => {
        let suma = 0;

        // Verificar si wasteArr es un array y tiene elementos
        if (Array.isArray(wasteArr) && wasteArr.length > 0) {
            for (let index = 0; index < wasteArr.length; index++) {
                // Verificar si laboratorio incluye el ID
                if (wasteArr[index].laboratorio === id) {
                    // Verificar si cantidadGenerada es un número antes de sumarlo
                    const cantidadGenerada = parseFloat(wasteArr[index].cantidadGenerada);
                    if (!isNaN(cantidadGenerada)) {
                        suma += cantidadGenerada;
                    }
                }
            }
        }

        return suma;
    };


    const cantidadGeneradaPorFacultad = (facultad, wasteArr) => {
        let suma = 0
        for (let index = 0; index < wasteArr?.length; index++) {
            if (wasteArr[index].facultad === facultad) {
                suma += parseFloat(wasteArr[index].cantidadGenerada)
            }
        }
        return suma;
    }

    const sumarCantidadPorFacultad = (arr) => {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorFacultad = {};

        // Recorrer el array de personas
        arr.forEach((a) => {
            const { facultad, cantidadGenerada } = a;

            // Verificar si ya existe el nombre en el objeto
            if (sumaPorFacultad[facultad]) {
                // Si existe, sumar la edad
                sumaPorFacultad[facultad] += parseFloat(cantidadGenerada);
            } else {
                // Si no existe, crear una nueva entrada en el objeto
                sumaPorFacultad[facultad] = parseFloat(cantidadGenerada);
            }
        });

        return sumaPorFacultad;
    }

    const sumarCantidadPorDestino = (arr) => {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorDestino = {};

        // Recorrer el array de personas
        arr.forEach((w) => {
            const { destino, cantidadGenerada } = w;

            // Verificar si ya existe el nombre en el objeto
            if (sumaPorDestino[destino]) {
                // Si existe, sumar la edad
                sumaPorDestino[destino] += parseFloat(cantidadGenerada);
            } else {
                // Si no existe, crear una nueva entrada en el objeto
                sumaPorDestino[destino] = parseFloat(cantidadGenerada);
            }
        });

        return sumaPorDestino;
    }

    const sumarCantidadPorPeriodo = (arr) => {
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
                sumaPorPeriodo[meses[month]] += parseFloat(cantidadFloat.toFixed(3)) + 0.0;
            } else {
                // Si no existe, crear una nueva entrada en el objeto
                sumaPorPeriodo[meses[month]] = parseFloat(cantidadFloat.toFixed(3)) + 0.0;
            }
        });

        return sumaPorPeriodo;
    }

    const sumarCantidadPorMes = (arr, year) => {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorMes = {};

        // Recorrer el array de personas
        arr.forEach((a) => {
            const { fechaCreacion, cantidadGenerada } = a;
            const month = new Date(fechaCreacion?.seconds * 1000).getMonth()
            const anio = new Date(fechaCreacion?.seconds * 1000).getFullYear()
            console.log(new Date(fechaCreacion?.seconds * 1000).toLocaleDateString('es-CO'));
            console.log(new Date(fechaCreacion?.seconds * 1000).getMonth());
            const cantidadFloat = parseFloat(cantidadGenerada)
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            // Verificar si ya existe el nombre en el objeto
            if (year == anio) {
                const clave = `${meses[month]}-${year}`
                if (sumaPorMes[clave]) {
                    // Si existe, sumar la edad
                    sumaPorMes[clave] += parseFloat(cantidadFloat.toFixed(3)) + 0.0;
                } else {
                    // Si no existe, crear una nueva entrada en el objeto
                    sumaPorMes[clave] = parseFloat(cantidadFloat.toFixed(3)) + 0.0;
                }
            }
        });

        return sumaPorMes;
    }

    const sumarCantidadPorSemestre = (arr, year) => {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorSemestre = {};
        // Recorrer el array de personas
        arr.forEach((a) => {
            const { fechaCreacion, cantidadGenerada } = a;
            let month = new Date(fechaCreacion?.seconds * 1000).getMonth()
            let anio = new Date(fechaCreacion?.seconds * 1000).getFullYear()
            if (month >= 0 && month <= 6) {
                month = 'Enero-Junio'
            } else {
                month = 'Julio-Diciembre'
            }
            console.log(new Date(fechaCreacion?.seconds * 1000).toLocaleDateString('es-CO'));
            console.log(new Date(fechaCreacion?.seconds * 1000).getMonth());
            const cantidadFloat = parseFloat(cantidadGenerada)
            const meses = ['Enero-Junio', 'Julio-Diciembre']
            // Verificar si ya existe el nombre en el objeto
            if (year == anio) {
                const clave = `${month}-${year}`
                if (sumaPorSemestre[clave]) {
                    // Si existe, sumar la edad
                    sumaPorSemestre[clave] += parseFloat(cantidadFloat.toFixed(3)) + 0.0;
                } else {
                    // Si no existe, crear una nueva entrada en el objeto
                    sumaPorSemestre[clave] = parseFloat(cantidadFloat.toFixed(3)) + 0.0;
                }
            }
        });

        return sumaPorSemestre;
    }

    const sumarCantidadPorYear = (arr) => {
        // Crear un objeto para almacenar la suma de edades por nombre
        const sumaPorYear = {};
        // Recorrer el array de personas
        arr.forEach((a) => {
            const { fechaCreacion, cantidadGenerada } = a;
            const year = new Date(fechaCreacion?.seconds * 1000).getFullYear()
            console.log(new Date(fechaCreacion?.seconds * 1000).toLocaleDateString('es-CO'));
            console.log(new Date(fechaCreacion?.seconds * 1000).getMonth());
            const cantidadFloat = parseFloat(cantidadGenerada)
            // Verificar si ya existe el nombre en el objeto
            if (sumaPorYear[year]) {
                // Si existe, sumar la edad
                sumaPorYear[year] += parseFloat(cantidadFloat.toFixed(3)) + 0.0;
            } else {
                // Si no existe, crear una nueva entrada en el objeto
                sumaPorYear[year] = parseFloat(cantidadFloat.toFixed(3)) + 0.0;
            }
        });

        return sumaPorYear;
    }

    const renderChartWasteByLab = () => {
        const existingChart = Chart.getChart('chartWasteByLab');
        if (existingChart) {
            existingChart.destroy();
        }

        console.log(waste, laboratorios, statements);
        const uniqueStatements = [...new Set(statements.map(st => st.id))]
        const uniqueLaboratorios = [...new Set(laboratorios.map(lab => lab.id))]
        const wasteByStatement = waste.map((w) => {
            const statement = statements.find((st) => st.id === w.id_declaracion);

            // Verificar si statement es undefined antes de acceder a id_laboratorio
            const laboratorio = statement ? statement.id_laboratorio : undefined;

            return { ...w, laboratorio };
        });

        let labs = laboratorios.map(lab => ({ ...lab, cantidadGenerada: sumaCantidadGenerada(lab.id, wasteByStatement) }))
        const statementsByLab = statements.map((index) => statements.filter(st => st.id_laboratorio === uniqueLaboratorios[index]))
        // const wasteByStatement = waste.map((index) => waste.filter(waste => waste.id_declaracion === uniqueStatements[index]))
        const wasteByLab = wasteByStatement.map((w, index) => { wasteByStatement.filter(wst => wst.laboratorio === uniqueLaboratorios[index]) })

        console.log("Wastee", labs);
        console.log("stBylab:\n", wasteByStatement);

        const labelsLabs = laboratorios.map(lab => lab.nombreLaboratorio)
        console.log(uniqueLaboratorios.map(m => wasteByStatement.filter(waste => waste.id_laboratorio === m).length));
        const data = {
            labels: labelsLabs,
            datasets: [
                {
                    label: 'Cantidad(kg) de residuos por laboratorio',
                    data: uniqueLaboratorios.map(m => labs.find(lab => lab.id === m).cantidadGenerada),
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
        new Chart('chartWasteByLab', { type: 'bar', data, options })
    }

    const renderChartWasteByDestiny = () => {
        const existingChart = Chart.getChart('chartWasteByDestiny');
        if (existingChart) {
            existingChart.destroy();
        }

        console.log(waste, laboratorios, statements);
        const uniqueDestiny = [...new Set(waste.map(w => w.destino))]
        const cantidades = sumarCantidadPorDestino(waste)
        console.log("CNAANANA:", cantidades);
        const newWasteByDestiny = Object.keys(cantidades).map((c, index) => ({ destino: c, cantidadGenerada: cantidades[c] }))
        console.log(newWasteByDestiny);
        const data = {
            labels: uniqueDestiny,
            datasets: [
                {
                    label: 'Cantidad(kg) residuos por destino de tratamiento',
                    data: uniqueDestiny.map(d => newWasteByDestiny.find(nw => nw.destino === d)?.cantidadGenerada),
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
        new Chart('chartWasteByDestiny', { type: 'pie', data, options })
    }

    const renderChartStatementsByLab = () => {

        const existingChart = Chart.getChart('chartStatementsByLab');
        if (existingChart) {
            existingChart.destroy();
        }

        console.log(waste, laboratorios, statements);
        const uniqueStatements = [...new Set(statements.map(st => st.id))]
        const uniqueLaboratorios = [...new Set(laboratorios.map(lab => lab.id))]
        const wasteByStatement = waste.map((w) => {
            const statement = statements.find((st) => st.id === w.id_declaracion);

            // Verificar si statement es undefined antes de acceder a id_laboratorio
            const laboratorio = statement ? statement.id_laboratorio : undefined;

            return { ...w, laboratorio };
        });

        let labs = laboratorios.map(lab => ({ ...lab, cantidadGenerada: sumaCantidadGenerada(lab.id, wasteByStatement) }))
        const statementsByLab = statements.map((st) => {
            const lab = laboratorios.find((lab) => lab.id === st.id_laboratorio);

            // Verificar si statement es undefined antes de acceder a id_laboratorio
            const laboratorio = lab ? lab.id : undefined;

            return { ...st, laboratorio };
        });

        // const wasteByStatement = waste.map((index) => waste.filter(waste => waste.id_declaracion === uniqueStatements[index]))
        const wasteByLab = wasteByStatement.map((w, index) => { wasteByStatement.filter(wst => wst.laboratorio === uniqueLaboratorios[index]) })

        console.log("Wastee", labs);
        console.log("stBylab:\n", wasteByStatement);

        const labelsLabs = laboratorios.map(lab => lab.nombreLaboratorio)
        const arrData = uniqueLaboratorios.map(m => statementsByLab.filter(st => st.laboratorio === m).length)
        console.log(uniqueLaboratorios.map(m => statementsByLab.filter(st => st.laboratorio === m).length));

        const data = {
            labels: labelsLabs,
            datasets: [
                {
                    label: "Declaraciones por laboratorio",
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
        new Chart('chartStatementsByLab', { type: 'bar', data, options })
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
        const wasteByFacultad = waste.map((w, index) => {
            const statement = statements[index];
            const laboratorio = laboratorios.find(lab => lab.id === statement?.id_laboratorio);

            // Verificar si laboratorio es undefined antes de acceder a facultad
            const facultad = laboratorio ? laboratorio.facultad : undefined;

            return { ...w, facultad };
        });

        const cantidades = sumarCantidadPorFacultad(wasteByFacultad)
        console.log(cantidades);
        const newWasteByFacultad = Object.keys(cantidades).map((c, index) => ({ facultad: c, cantidadGenerada: cantidades[c] }))
        const wasteByStatement = waste.map((w) => {
            const statement = statements.find((st) => st.id == w.id_declaracion);

            // Verificar si statement es undefined antes de acceder a id_laboratorio
            const idLaboratorio = statement ? statement.id_laboratorio : undefined;

            return { ...w, laboratorio: idLaboratorio };
        });

        let labs = laboratorios.map(lab => ({ ...lab, cantidadGenerada: sumaCantidadGenerada(lab.id, wasteByStatement) }))
        //const wasteByLab = wasteByStatement.map((w, index) => { wasteByStatement.filter(wst => wst.laboratorio === uniqueLaboratorios[index]) })

        //console.log("Wastee", wasteByLab);
        console.log("wasteByFacultad:\n", newWasteByFacultad);

        const labelsLabs = laboratorios.map(lab => lab.nombreLaboratorio)
        const data = {
            labels: uniqueFacultades,
            datasets: [
                {
                    label: 'Cantidad(kg) de residuos por facultad',
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

    const getWasteByMonth = (year) => {
        const existingChart = Chart.getChart('chartWasteByPeriod');

        if (existingChart) {
            existingChart.destroy();
        }
        const wasteByPeriod = waste.map((w) => {
            const statement = statements.find((st) => st.id == w.id_declaracion);

            const fechaCreacion = statement ? statement.fecha_creacion : undefined;

            return { ...w, fechaCreacion };
        });
        const cantidades = sumarCantidadPorMes(wasteByPeriod, year)
        console.log(cantidades);
        const newWasteByPeriod = Object.keys(cantidades).map((c, index) => ({ monthYear: c, cantidadGenerada: cantidades[c] }))
        console.log("wasteByPeriod:\n", newWasteByPeriod);
        const labelsMonthYear = [`Enero-${year}`, `Febrero-${year}`, `Marzo-${year}`, `Abril-${year}`, `Mayo-${year}`, `Junio-${year}`, `Julio-${year}`,
        `Agosto-${year}`, `Septiembre-${year}`, `Octubre-${year}`, `Noviembre-${year}`, `Diciembre-${year}`]
        const arrData = labelsMonthYear.map(my => {
            const valorEncontrado = newWasteByPeriod.find(nw => {
                console.log(nw.monthYear === my);
                return nw.monthYear === my
            });
            console.log('Valor encontrado: ', valorEncontrado);
            const numeroAleatorio = 0 + Math.random() * 0.9;
            return valorEncontrado !== undefined ? valorEncontrado.cantidadGenerada : 0;
        });

        const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        const data = {
            labels: labels,
            datasets: [
                {
                    label: `Cantidad(kg) de residuos generados por mes en el año ${year}`,
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        new Chart('chartWasteByPeriod', { type: 'line', data, options })
    }

    const getWasteBySemester = (year) => {
        const existingChart = Chart.getChart('chartWasteByPeriod');

        if (existingChart) {
            existingChart.destroy();
        }
        const wasteByPeriod = waste.map((w) => {
            const statement = statements.find((st) => st.id == w.id_declaracion);

            const fechaCreacion = statement ? statement.fecha_creacion : undefined;

            return { ...w, fechaCreacion };
        });
        const cantidades = sumarCantidadPorSemestre(wasteByPeriod, year)
        const newWasteByPeriod = Object.keys(cantidades).map((c, index) => ({ semestre: c, cantidadGenerada: cantidades[c] }))
        console.log("wasteByPeriod:\n", newWasteByPeriod);
        const labels = ["Enero-Junio", "Julio-Diciembre"]
        const labelsSemesterYear = [`Enero-Junio-${year}`, `Julio-Diciembre-${year}`]
        const arrData = labelsSemesterYear.map(semestre => {
            const valorEncontrado = newWasteByPeriod.find(nw => nw.semestre === semestre)?.cantidadGenerada;
            const numeroAleatorio = 0 + Math.random() * 0.9;
            return valorEncontrado !== undefined ? valorEncontrado : 0;
        });

        const data = {
            labels: labels,
            datasets: [
                {
                    label: `Cantidad(kg) de residuos generados por semestre en el año ${year} `,
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        new Chart('chartWasteByPeriod', { type: 'bar', data, options })
    }

    const getWasteByYear = () => {
        const existingChart = Chart.getChart('chartWasteByPeriod');

        if (existingChart) {
            existingChart.destroy();
        }
        const wasteByPeriod = waste.map((w) => {
            const statement = statements.find((st) => st.id == w.id_declaracion);

            const fechaCreacion = statement ? statement.fecha_creacion : undefined;

            return { ...w, fechaCreacion };
        });
        const cantidades = sumarCantidadPorYear(wasteByPeriod)
        const newWasteByPeriod = Object.keys(cantidades).map((c, index) => ({ year: c, cantidadGenerada: cantidades[c] }))
        console.log("wasteByPeriod:\n", newWasteByPeriod);
        const labels = [...years.map(y => `${y}`)]
        const arrData = labels.map(y => {
            const valorEncontrado = newWasteByPeriod.find(nw => nw.year === y)?.cantidadGenerada;
            const numeroAleatorio = 0 + Math.random() * 0.9;
            return valorEncontrado !== undefined ? valorEncontrado : numeroAleatorio;
        });

        const data = {
            labels: labels,
            datasets: [
                {
                    label: `Cantidad(kg) de residuos generados en el año ${year}`,
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        new Chart('chartWasteByPeriod', { type: 'bar', data, options })
    }

    const renderChartWasteByPeriod = (filtro, year) => {
        if (filtro === "Mes") {
            getWasteByMonth(year)
        } else if (filtro === "Semestre") {
            getWasteBySemester(year)
        } else if (filtro === "Year") {
            getWasteByYear()
        }
    }

    return (
        <Container sx={{ py: 4, pt: 1 }}>
            <CustomTooltip title="Refrescar" placement="right">
                <IconButton sx={{ color: "red" }} onClick={() => { renderAllCharts() }}><RefreshIcon fontSize='large' /></IconButton>
            </CustomTooltip>
            {/* <Button onClick={() => { renderAllCharts() }}>Chart</Button> */}
            <Grid container gap={2} sx={{ mt: 2 }}>
                <Grid item container md={12} sx={{ justifyContent: "space-around" }}>
                    <Grid container item md={10} sx={{ p: 2 }} component={Card} elevation={5}>
                        <Grid item md={12}>
                            <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: 25, mb: 4 }}> Cantidad(kg)  de residuos generados por laboratorio</Typography>
                            <canvas id="chartWasteByLab"></canvas>
                        </Grid>
                    </Grid>
                    <Grid container item md={10} sx={{ p: 2, mt: 4 }} component={Card} elevation={5}>
                        <Grid item md={12}>
                            <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: 25, mb: 4 }}>Cantidad(kg) de residuos generados por facultad</Typography>
                            <canvas id="chartWasteByFacultad"></canvas>
                        </Grid>
                    </Grid>
                    <Grid container item md={10} sx={{ p: 2, mt: 4 }} component={Card} elevation={5}>
                        <Grid item md={12}>
                            <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: 25, mb: 4 }}>Cantidad(kg) de residuos por periodo</Typography>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", justifyContent: "right" }}>
                            <FormControl sx={{ mb: 2, width: "30%", mr: 4 }}>
                                <InputLabel id="simple-select-filtro">Filtro</InputLabel>
                                <Select
                                    labelId="simple-select-filtro"
                                    id="select-filtro"
                                    value={filtro}
                                    label="Filtro"
                                    onChange={handleChangeFiltro}
                                >
                                    {filtros.map(f => (
                                        <MenuItem value={f.value}>{f.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mb: 2, width: "30%", mr: 4 }} disabled={filtro === "Year"}>
                                <InputLabel id="simple-select-year">Año</InputLabel>
                                <Select
                                    labelId="simple-select-year"
                                    id="select-year"
                                    value={year}
                                    label="Año"
                                    onChange={handleChange}
                                >
                                    {years.map(y => (
                                        <MenuItem value={y}>{y === "Year" ? "Año" : y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12}>
                            <canvas id="chartWasteByPeriod"></canvas>
                        </Grid>
                    </Grid>
                    <Grid container item md={10} sx={{ p: 2, mt: 4 }} component={Card} elevation={5}>
                        <Grid item md={12}>
                            <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: 25, mb: 4 }}>Cantidad de declaraciones por laboratorio</Typography>
                            <canvas id="chartStatementsByLab"></canvas>
                        </Grid>
                    </Grid>
                    <Grid container item md={10} sx={{ p: 2, mt: 4, display: "flex", justifyContent: "center" }} component={Card} elevation={5}>
                        <Grid item container md={12}>
                            <Grid item md={12}>
                                <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: 25, mb: 4 }}>Cantidad(kg) residuos por destino de tratamiento</Typography>
                            </Grid>
                            <Grid item md={5} sx={{mx:"auto"}}>
                                <canvas id="chartWasteByDestiny"></canvas>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Box sx={{ width: "500px" }}>

            </Box>
            <Box sx={{ width: "500px" }}>
                <canvas id="segundoChart"></canvas>
            </Box> */}
        </Container>
    )
}

export default OperatorReports

/*const renderChartWasteByPeriod = () => {
        const existingChart = Chart.getChart('chartWasteByPeriod');

        if (existingChart) {
            existingChart.destroy();
        }
        console.log([...new Set(statements.map(s => new Date(s.fecha_creacion?.seconds * 1000).getFullYear()))]);
        const wasteByPeriod = waste.map((w) => {
            const statement = statements.find((st) => st.id == w.id_declaracion);

            // Verificar si statement es undefined antes de acceder a fecha_creacion
            const fechaCreacion = statement ? statement.fecha_creacion : undefined;

            return { ...w, fechaCreacion };
        });

        const cantidades = sumarCantidadPorSemestre(wasteByPeriod)
        console.log(cantidades);
        const newWasteByPeriod = Object.keys(cantidades).map((c, index) => ({ semestre: c, cantidadGenerada: cantidades[c] }))
        console.log("wasteByPeriod:\n", newWasteByPeriod);
        const labels = ['Enero-Junio', 'Julio-Diciembre']
        const arrData = labels.map(semestre => {
            const valorEncontrado = newWasteByPeriod.find(nw => nw.semestre === semestre)?.cantidadGenerada;
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        new Chart('chartWasteByPeriod', { type: 'bar', data, options })
    }*/