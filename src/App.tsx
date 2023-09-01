import Login from "./Pages/Login/Authorize";
import Token from "./Pages/Login/Token";
import Landing from "./Pages/Landing/Landing";
import Buffet from "./Pages/Buffet/Buffet";
import Lobby from "./Pages/Lobby/Lobby";
import Game from "./Pages/Game/Game";
import Sandbox from "./Pages/Test/Sandbox";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <CookiesProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Token" element={<Token />} />
            <Route path="/Landing" element={<Landing />} />
            <Route path="/Buffet" element={<Buffet />} />
            <Route path="/Lobby" element={<Lobby />} />
            <Route path="/Game" element={<Game />} />
            <Route path="/Sandbox" element={<Sandbox />} />
          </Routes>
        </Router>
      </div>
    </CookiesProvider>
  );
}

export default App;
