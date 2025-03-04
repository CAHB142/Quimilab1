import { useAuth } from "../context/AuthContext"
import {Navigate} from "react-router-dom"; 
import LinearProgress from '@mui/material/LinearProgress';


export function ProtectedRoute ({children}){
    const {usere, loading} = useAuth()
    if (loading) return <LinearProgress />
    if (!usere) return <Navigate to='/'/>
    return<>{children}</>
}