import * as React from 'react';
import {Tabs,Tab} from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/material';
import StatementsList from '../components/Statements/StatementsList';
import { ScheduleVerification } from '../components/tracing/ScheduleVerification';

export function Seguimiento(){ 

     const [selectedTab,setSelectedTab] = useState(0);

     const handleChange = (event,newValue) => {
      setSelectedTab( newValue );
     };
        
    return (
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={selectedTab} onChange={handleChange} centered textColor='primary' TabIndicatorProps={{sx:{backgroundColor:'red'}}}>
           <Tab label="Agenda de verificacion"  />
           <Tab label="Verificacion"  />
           <Tab label="Agenda de Recepcion"  />
           <Tab label="Recepcion"  />
           <Tab label="Finalizadas"  />
        </Tabs>
        {selectedTab === 0 && <ScheduleVerification/>}
      </Box>
      
       

    
    );
}

export default function Dashboard() {
    return <Seguimiento/>;
}