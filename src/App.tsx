import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import Buffet from "./pages/Buffet/Buffet";
import Lobby from "./pages/Lobby/Lobby";
import Game from "./pages/Game/Game";
import Sandbox from "./pages/Test/Sandbox";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home/Home";

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
            <Route path="/" element={<Home />} />
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