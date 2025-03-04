import React from 'react'
import UsuariosList from './UsuariosList'


export function  Usuarios(){
  return (
    <UsuariosList/>    
  )
}

export default function Dashboard() {
  return <Usuarios/>;
}
