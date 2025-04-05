import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/(Auth)/Register/Register";
import { ToastContainer } from "react-toastify";
import Login from "./pages/(Auth)/Login/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Register />} path="/register" />
        <Route element={<Login />} path="/login" />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
