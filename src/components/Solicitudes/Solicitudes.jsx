import React from 'react'
import SolicitudesList from './SolicitudesList'

export function Solicitudes(){
  return (
    <SolicitudesList/>
    )
}

export default function Dashboard() {
  return <Solicitudes/>;
}