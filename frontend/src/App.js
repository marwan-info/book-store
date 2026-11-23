import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import Cart from './pages/Cart';
import Orders from './pages/Order';
import AdminDashboard from './pages/AdminDashboard';
import './style.css';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Navigate to='/books' replace />} />
          <Route path='/books' element={<Books />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/cart' element={<ProtectedRoute role='client'><Cart /></ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute role='client'><Orders /></ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
          <Route path='*' element={<Navigate to='/books' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}