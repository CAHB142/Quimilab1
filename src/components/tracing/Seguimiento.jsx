import React, { lazy, Suspense } from 'react';
import { Tabs, Tab, Button, Card } from '@mui/material';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
// import ListByEtapa from './ListByEtapa';
import { useAuthStatement } from "../../hooks/AuthContextStatements"
import { useAuthTracing } from '../../hooks/AuthContextTracing';
import { useAuth as useAuthUsuarios } from '../../hooks/AuthContextUsuarios';
import { useAuth } from '../../context/AuthContext';
import ListByEtapa from './ListByEtapa';

export function Seguimiento() {

    const { getStatementsByEtapa, getWaste, getCorrientes, getStatements } = useAuthStatement();
    const { getRevisionResiduos, getRecepcionResiduos } = useAuthTracing()
    const { getData } = useAuthUsuarios()
    const { usere } = useAuth()
    const [selectedTab, setSelectedTab] = useState(0);
    const [componente, setComponente] = useState(<ListByEtapa etapa={1} />)

    const handleChange = (event, newValue) => {
        event.preventDefault()
        setSelectedTab(newValue);
        // switch (newValue) {
        //     case 0:
        //         setComponente(<ListByEtapa etapa={1} />)
        //         break;
        //     case 1:
        //         setComponente(<ListByEtapa etapa={2} />)
        //         break
        //     case 2:
        //         setComponente(<ListByEtapa etapa={3} />)
        //         break
        //     case 3:
        //         setComponente(<ListByEtapa etapa={4} />)
        //         break
        //     case 4:
        //         setComponente(<ListByEtapa etapa={5} />)
        //         break
        //     default:
        //         break;
        // }
        //console.clear()
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getStatementsByEtapa(1),
                    getWaste(),
                    getCorrientes(),
                    getRevisionResiduos(),
                    getRecepcionResiduos(),
                    getData(),
                    getStatements(usere.uid, usere.rol),
                ]);
                console.log("Seguimiento");
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', pt: 2 }}>
            <Tabs value={selectedTab} onChange={handleChange} centered textColor='primary' TabIndicatorProps={{ sx: { backgroundColor: 'red' } }} sx={{ pb: 1, mx: 3 }} component={Card} elevation={5}>
                <Tab label="Agenda verificacion" onClick={async () => await getStatementsByEtapa(1)} />
                <Tab label="Verificacion" onClick={async () => await getStatementsByEtapa(2)} />
                <Tab label="Agenda recepcion" onClick={async () => await getStatementsByEtapa(3)} />
                <Tab label="Recepcion" onClick={async () => await getStatementsByEtapa(4)} />
                <Tab label="Finalizadas" onClick={async () => await getStatementsByEtapa(5)} />
            </Tabs>
            {/* {selectedTab === 0 && <ScheduleVerification etapa={1}/>} */}
                {selectedTab === 0 && <ListByEtapa etapa={1} />}
                {selectedTab === 1 && <ListByEtapa etapa={2} />}
                {selectedTab === 2 && <ListByEtapa etapa={3} />}
                {selectedTab === 3 && <ListByEtapa etapa={4} />}
                {selectedTab === 4 && <ListByEtapa etapa={5} />}
                {/* Renderiza otros componentes según sea necesario */}
           
            {/* {componente} */}
        </Box>
    );
}

export default function Dashboard() {
    return <Seguimiento />;
}   