import Login from "./Pages/Login/Authorize";
import Landing from "./Pages/Landing/Landing";
import Buffet from "./Pages/Buffet/Buffet";
import Lobby from "./Pages/Lobby/Lobby";
import Game from "./Pages/Game/Game";
import Token from "./Components/Token";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Token" element={<Token />} />
          <Route path="/Landing" element={<Landing />} />
          <Route path="/Buffet" element={<Buffet />} />
          <Route path="/Lobby" element={<Lobby />} />
          <Route path="/Game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
