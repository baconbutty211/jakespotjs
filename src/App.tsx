import Login from "./Pages/Login/Authorize";
import Token from "./Pages/Login/Token";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Token" element={<Token />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
