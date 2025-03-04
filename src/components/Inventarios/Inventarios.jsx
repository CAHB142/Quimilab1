import React from 'react'
import InventariosList from './InventariosList'

export function Inventarios(){
  return (
    <InventariosList/> 
  )
}

export default function Dashboard() {
  return <Inventarios/>;
}