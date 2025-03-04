import React from "react";
import logounivalle from "../assets/img/LogoUV.png";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

const Footer = () =>{
    return(
        <footer>
        <div className="container--body">
          <div className ="colum1">
            <img src = {logounivalle} alt="Imagen UV" className="imgLogoUnivalle"/>
          </div>
          <div className ="colum2">
              <h1> Universidad del Valle</h1>
              <h2> Santiago de Cali, Valle del Cauca, Colombia</h2>
              <h2> Ciudad Universitaria Melendez</h2>
              <h2> Calle 13 # 100 - 00</h2>
          </div>
          <div className ="colum3">
              <h1> Servicios Varios y Gestión Ambiental</h1>
              <div className="row">
                <EmailIcon sx={{ fontSize: 30 }} />
              <label>servicios.varios@correounivalle.edu.co</label>
              </div>
              <div className="row">
                <PhoneIcon sx={{ fontSize: 30 }} />                
                <label>+57 602 3212100 - Ext. 2237</label>
              </div>
              <div className="row">
                <HomeIcon sx={{ fontSize: 30 }} />                
                <label>Edificio E1, espacio 2057</label>
              </div>
          </div>
        </div>
      </footer>
      
    )
}


export default Footer

