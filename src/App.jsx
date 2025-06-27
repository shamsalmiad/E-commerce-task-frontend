import { Link, Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css'
import Login from './component/Login';
import Register from './component/Register';
import Dashboard from './component/Dashboard';
import PrivateRoute from './component/PrivateRoute';

function App() {
   return (
    
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
