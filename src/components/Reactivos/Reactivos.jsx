import React from 'react'
import ReactivosList from './ReactivosList'

export function  Reactivos(){
  return (
    <ReactivosList/>
  )
}

export default function Dashboard() {
  return <Reactivos/>;
}

