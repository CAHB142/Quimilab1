import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Carrousel from "./Carrousel";
import { ThemeProvider } from "styled-components";
import theme from "../temaConfig";

export function Home(){
    
    return (
        <ThemeProvider theme ={theme}>
        <Navbar/>
        <Carrousel/>
        <Footer/>
        </ThemeProvider>
    )
}
