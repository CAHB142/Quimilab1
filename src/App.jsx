import React from "react";
import { Routes, Route} from 'react-router-dom';
import {Home} from "./components/Home";
import {Generador} from "./components/Generador";
import {ContenedorPrincipal} from "./components/ContenedorPrincipal";
import {Administrador} from "./components/Administrador";
import {Invitado} from "./components/Invitado";
import {Operador} from "./components/Operador";
import {Registro} from "./components/Registro";
import {AuthProvider} from "./context/AuthContext";
import {AuthProviderReactivos} from "./hooks/AuthContextReactivos";
import {AuthProviderRequest} from "./hooks/AuthContextRequest"
import {AuthProviderLaboratorios} from "./hooks/AuthContextLaboratorios";
import {AuthProviderUsuarios} from "./hooks/AuthContextUsuarios";
import {AuthProviderPruebas} from "./hooks/AuthContextPruebas";
import { AuthProviderDeclaraciones } from "./hooks/AuthContextStatements";
import { AuthProviderInventarios } from "./hooks/AuthContextInventarios";
import {AuthProviderBolsaReactivo} from "./hooks/AuthContextBolsaReactivos"
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedRouteHome } from "./components/ProtectedRouteHome";
import {Seguimiento} from './components/tracing/Seguimiento'
import { PerfilUsuario } from "./rutasComponents/PerfilUsuario";
import { RecuperarCon } from "./rutasComponents/RecuperarCon";
import {Statements} from './components/Statements/Statements';
import {Reactivos} from './components/Reactivos/Reactivos';
import {Usuarios} from './components/Usuarios/Usuarios';
import {Laboratorios} from './components/Laboratorios/Laboratorios';
import {Inventarios} from "./components/Inventarios/Inventarios";
import {BolsaReactivos} from "./components/BolsaReactivos/BolsaReactivos";
import {PruebasEnsayos} from './components/PruebasEnsayos/PruebasEnsayos';
import  UsuarioNoRegistrado  from "./components/UsuarioNoRegistrado";
import {Solicitudes} from "./components/Solicitudes/Solicitudes";
import { AuthProviderTracing } from "./hooks/AuthContextTracing";
import Reports from "./components/Reports/Reports";


function App() {

  return (
    <AuthProvider>
      <AuthProviderReactivos>
      <AuthProviderLaboratorios>
      <AuthProviderUsuarios>
      <AuthProviderDeclaraciones>
      <AuthProviderTracing>
      <AuthProviderPruebas>
      <AuthProviderInventarios>
      <AuthProviderBolsaReactivo>
      <AuthProviderRequest>
      <ContenedorPrincipal>
      <Routes>
        <Route path="/Registro" element ={<Registro/>} />
        <Route path="/RecuperarCon" element ={<RecuperarCon/>} />
        <Route path="/UsuarioNoRegistrado" element ={<UsuarioNoRegistrado/>} />
        <Route path="/Seguimiento" element ={
          <ProtectedRoute>
            <Seguimiento/>
          </ProtectedRoute>
        } />
          
        <Route path="/Declaraciones" element ={
          <ProtectedRoute>
            <Statements/>
          </ProtectedRoute>
        } />

        <Route path="/Reportes" element ={
          <ProtectedRoute>
            <Reports/>
          </ProtectedRoute>
        } />

        <Route path="/Reactivos" element ={
          <ProtectedRoute>
            <Reactivos/>
          </ProtectedRoute>
        } />

        <Route path="/Usuarios" element ={
          <ProtectedRoute>
            <Usuarios/>
          </ProtectedRoute>
        } />

        <Route path="/Inventarios" element ={
          <ProtectedRoute>
            <Inventarios/>
          </ProtectedRoute>
        } />

        <Route path="/Laboratorios" element ={
          <ProtectedRoute>
            <Laboratorios/>
          </ProtectedRoute>
        } />

        <Route path="/BolsaReactivos" element ={
          <ProtectedRoute>
            <BolsaReactivos/>
          </ProtectedRoute>
        } />

        <Route path="/PruebasEnsayos" element ={
          <ProtectedRoute>
            <PruebasEnsayos/>
          </ProtectedRoute>
        } />

        <Route path="/Solicitudes" element ={
          <ProtectedRoute>
            <Solicitudes/>
          </ProtectedRoute>
        } />

        <Route path="/PerfilUsuario" element ={
          <ProtectedRoute>
            <PerfilUsuario/>
          </ProtectedRoute>
        } />
        
        <Route path="/Generador" element ={
        <ProtectedRoute>
          <Generador/>
        </ProtectedRoute>
        } />
        <Route path="/Operador" element ={
          <ProtectedRoute>
          <Operador/>
        </ProtectedRoute>
        } />
        <Route path="/Administrador" element ={
        <ProtectedRoute>
          <Administrador/>
        </ProtectedRoute>
        } />

        <Route path="/Invitado" element ={
          <ProtectedRoute>
            <Invitado/>
          </ProtectedRoute>
        } />

        <Route path="/" element ={
          <ProtectedRouteHome>
          <Home/>
        </ProtectedRouteHome>} />
      </Routes>
      
      </ContenedorPrincipal>
      </AuthProviderRequest>
      </AuthProviderBolsaReactivo>
      </AuthProviderInventarios>
      </AuthProviderPruebas>
      </AuthProviderTracing>
      </AuthProviderDeclaraciones>
      </AuthProviderUsuarios>
      </AuthProviderLaboratorios>
      </AuthProviderReactivos>
    </AuthProvider>
  );
}

export default App;
