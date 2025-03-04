import React from 'react'
import LaboratoriosList from './LaboratoriosList'

export function Laboratorios(){
  return (
    <LaboratoriosList/>
  )
}

export default function Dashboard() {
  return <Laboratorios/>;
}

