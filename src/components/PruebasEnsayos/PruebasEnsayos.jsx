import React from 'react'
import PruebasEnsayosList from './PruebasEnsayosList'


export function PruebasEnsayos(){
  return (
    <PruebasEnsayosList/>    
  )
}

export default function Dashboard() {
  return <PruebasEnsayos/>;
}
