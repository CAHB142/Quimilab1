import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import StatementsList from './StatementsList'
import { useAuth } from '../../context/AuthContext'
import { useAuthStatement } from '../../hooks/AuthContextStatements'
import { useAuth as useAuthUsuarios } from '../../hooks/AuthContextUsuarios'

export function Statements() {

  const { usere } = useAuth()
  const { getStatements, getWaste } = useAuthStatement()
  const { getUserById } = useAuthUsuarios()

  useEffect(() => {
    console.log("USEREE",usere);
    getStatements(usere.uid, usere.rol)
    getUserById(usere.uid)

  }, [])

  return (
    <Box sx={{ py: 2 }}>
      <StatementsList />
    </Box>
  )
}

export default function Dashboard() {
  return <Statements />;
}
