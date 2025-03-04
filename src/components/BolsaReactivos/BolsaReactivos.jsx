import React from 'react'
import BolsaReactivosList from './BolsaReactivosList'

export function BolsaReactivos(){
  return (
    <BolsaReactivosList/>
    )
}

export default function Dashboard() {
  return <BolsaReactivos/>;
}