import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/(Auth)/Register/Register";
import { ToastContainer } from "react-toastify";
import Login from "./pages/(Auth)/Login/Login";
import Layout from "./Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import { useEffect, useState } from "react";
import { auth } from "./components/firebase";
import Journal from "./pages/Journal/Journal";
import Sos from "./pages/SOS/Sos";

export default function App() {
  const [user, setUser] = useState<any>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <Router>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route
          element={user ? <Navigate to="/dashboard" /> : <Register />}
          path="/register"
        />
        <Route element={<Login />} path="/login" />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/journal"
          element={
            <Layout>
              <Journal />
            </Layout>
          }
        />
        <Route
          path="/sos"
          element={
            <Layout>
              <Sos />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
