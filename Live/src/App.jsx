import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorAuth } from './componentes/AuthContext.jsx';
import NavBar from './componentes/header.jsx';
import Footer from "./componentes/footer.jsx";
import Main from "./componentes/Main.jsx" 
import About from "./componentes/SobreMi.jsx"
import Content from "./componentes/Contenido.jsx"
import Encuesta from "./componentes/Encuesta.jsx"
import StaffPage from "./componentes/StaffPage.jsx"; 
import ScrollToTopOrHash from './componentes/ScrollToTopOrHash.jsx';
import Login from "./componentes/Login.jsx"
import Registro from "./componentes/Registro.jsx"
import Calendario from "./componentes/Calendario.jsx"
import SeccionJefe from "./componentes/seccionJefe.jsx";
import SeccionLive from "./componentes/seccionLive.jsx";

function HomePage() {
  return (
    <>
    <Main />
    <About />
    <Content />
    <Calendario />
    <Encuesta />
    </>
  );
}

function StaffWithMainPage() {
  return (
    <>
    <Main />
    <StaffPage />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
    <ScrollToTopOrHash /> 
      <ProveedorAuth>
        <div className="relative w-full min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300"> 
          <div className="relative z-20 flex flex-col flex-grow">
            
            <NavBar /> 
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/staff" element={<StaffWithMainPage />} />
              <Route path="/login" element={<Login />} /> 
              <Route path="/register" element={<Registro />} />
              <Route path="/dashboard/admin" element={<SeccionJefe />} />
              <Route path="/dashboard/lives" element={<SeccionLive />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </ProveedorAuth>
    </BrowserRouter>
  );
}

export default App;