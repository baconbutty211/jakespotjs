import Login from "./pages/Login/Login.tsx";
import Landing from "./pages/Landing/Landing.tsx";
import Buffet from "./pages/Buffet/Buffet.tsx";
import Lobby from "./pages/Lobby/Lobby.tsx";
import Game from "./pages/Game/Game.tsx";
import Sandbox from "./pages/Test/Sandbox.tsx";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

export default function App() {
  // PrivateRoutes Check
  // If user logged in:
  //   Send to requested page
  // Else:
  //   Send to Login page

  return (
    <CookiesProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} /> {/* Need to change to home page.*/}
            <Route path="/Login" element={<Login />} />
            <Route path="/Landing" element={
            <PrivateRoute>
              <Landing /> 
            </PrivateRoute>
            } />
            
            <Route path="/Buffet" element={
              <PrivateRoute>
                <Buffet />
              </PrivateRoute>
            } />
            <Route path="/Lobby" element={
              <PrivateRoute>
                <Lobby />
              </PrivateRoute>
            } />
            <Route path="/Game" element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            } />
            <Route path="/Sandbox" element={ 
              <PrivateRoute>
                <Sandbox />
              </PrivateRoute> 
            }/>
          </Routes>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}