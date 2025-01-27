import React from 'react';
import './App.css';
import './estilos.css';
import NoEncontrado from './componentes/NoEncontrado';
import Login from './componentes/Login'; 
import Registro from './componentes/Registro'; 
import CambiarContrasena from './componentes/CambioContrasena';
import Logout from './componentes/Logout';
import Dashboard from './componentes/Dashboard/Dashboard';
import { BrowserRouter, Routes, Route} from 'react-router-dom'; 
import VerMisDatos from './componentes/VerMisDatos';
import MisDatos from './componentes/MisDatos';
import { UsuarioProvider } from './hooks/UsuarioContext';
import CrearGrupoDeViaje from './componentes/CrearGrupoDeViaje';
import { PaisProvider } from './hooks/PaisContext';
import { CiudadProvider } from './hooks/CiudadContext';
import PoliticaDePrivacidad from './componentes/PoliticaDePrivacidad';
import TerminosYCondiciones from './componentes/TerminosYCondiciones'; 
import MisGrupos from './componentes/MisGrupos';
import Catalogos from './componentes/Catalogos';
import Hoteles from './componentes/Hoteles';
import Aeropuertos from './componentes/Aeropuertos';
import Vuelos from './componentes/Vuelos';
import Aerolineas from './componentes/Aerolineas';
import Traslados from './componentes/Traslados';
import AgregarViajeroAGrupo from './componentes/AgregarViajeroAGrupo';
import DondeEstoy from './componentes/DondeEstoy';
import CrearItinerario from './componentes/CrearItinerario';
import VerItinerario from './componentes/VerItinerraio';
import RecuperarContrasena from './componentes/RecuperarContrasena'; // Asegúrate de que la ruta sea correcta
import { Layout } from './componentes/Layout';
import { SnackbarProvider } from './hooks/useSnackbar';
import CrearEvento from './componentes/CrearEvento';
import AgregarActividad from './componentes/AgregarActividad';
import DetallesItinerario from './componentes/DetallesItinerario';
import DondeEstoy2 from './componentes/DondeEstoy2';

const App = () => {

  return (
    <UsuarioProvider>
      <SnackbarProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Layout>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/404" element={<NoEncontrado />} />
              <Route path="*" element={<NoEncontrado />} />
              <Route path="/politicaDePrivacidad" element={<PoliticaDePrivacidad />} />
              <Route path="/terminos" element={<TerminosYCondiciones />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/verMisDatos" element={<VerMisDatos />} />
              <Route path="/misDatos" element={<MisDatos />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/misGrupos" element={<MisGrupos />} />
              <Route path="/catalogos" element={<Catalogos />} />
              <Route path="/donde-estoy" element={<DondeEstoy />} />
              <Route path="/hoteles" element={<Hoteles />} />
              <Route path="/aeropuertos" element={<Aeropuertos />} />
              <Route path="/vuelos" element={<Vuelos />} />
              <Route path="/aerolineas" element={<Aerolineas />} />
              <Route path="/traslados" element={<Traslados />} />
              <Route path="/crear-itinerario" element={<CrearItinerario />} />
              <Route path="/VerItinerario" element={<VerItinerario/>} />
              <Route path="/crear-eventos/:itinerarioId" element={<CrearEvento />} />
              <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
              <Route path="/agregar-actividad/:itinerarioId" element={<AgregarActividad />} />
              <Route path="/itinerario/:id/eventos" element={<DetallesItinerario/>} />
              {/* Aquí solo el componente CrearGrupoDeViaje tiene acceso a los contextos de Pais y Ciudad */}
              <Route path="/crearGrupo" element={
                  <PaisProvider>
                  <CiudadProvider>
                  
                      <CrearGrupoDeViaje />
                    </CiudadProvider>
                  </PaisProvider>
              } />

              <Route path="/donde-estoy2" element={<DondeEstoy2 />} /> 
              <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/agregarViajeroAGrupo/:grupoId" element={<AgregarViajeroAGrupo />} />
          </Routes>
          </Layout>
        </BrowserRouter>
        </SnackbarProvider>
    </UsuarioProvider>
  );
}

export default App;