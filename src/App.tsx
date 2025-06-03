import Landing from "./pages/Landing/Landing";
import Buffet from "./pages/Buffet/Buffet";
import Lobby from "./pages/Lobby/Lobby";
import Game from "./pages/Game/Game";
import Sandbox from "./pages/Test/Sandbox";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
            
            <Route path="/Landing" element={
              <Landing /> 
            } />
            <Route path="/Buffet" element={
                <Buffet />
            } />
            <Route path="/Lobby" element={
                <Lobby />
            } />
            <Route path="/Game" element={
                <Game />
            } />

            <Route path="/Sandbox" element={ 
                <Sandbox />
            }/>
          </Routes>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}