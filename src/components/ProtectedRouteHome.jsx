import { useAuth } from "../context/AuthContext"
import {Navigate} from "react-router-dom"; 
import LinearProgress from '@mui/material/LinearProgress';

export function ProtectedRouteHome ({children}){
    const {usere, loading} = useAuth()
    if (loading) return <LinearProgress />
    if (usere){
        switch (usere.rol){
            case "Administrador":
                return <Navigate to={"/Administrador"} />
            case "Generador":
                return <Navigate to={"/Generador"} />
            case "Operador":
                return <Navigate to={"/Operador"} />
            case "Invitado":
                return <Navigate to={"/Invitado"} />
            default:
                return<>{children}</>
            };
    }
        
    return<>{children}</>
}