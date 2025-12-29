import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import TenantLanding from "./pages/TenantLanding";
import OwnerLanding from "./pages/OwnerLanding";

function AppWithNavbar() {
  const location = useLocation();
  const noNavbarRoutes = ['/login', '/register'];
  
  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/tenant" element={<TenantLanding />} />
        <Route path="/owner" element={<OwnerLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWithNavbar />
    </BrowserRouter>
  );
}

export default App;
