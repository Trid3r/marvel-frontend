import './App.css';
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Log from "./components/Log";
import AuthService from "./services/authService";

function App() {

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (!user) {
      AuthService.setCurrentUser();
    }
  }, []);

  return (
    <div className="App">
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log" element={<Log />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
