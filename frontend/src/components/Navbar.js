import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
  <Link to='/books' className='brand'>BookStore</Link>
  <Link to='/books'>Books</Link>
  {user?.role === 'client' && (
    <>
      <Link to='/cart'>Cart</Link>
      <Link to='/orders'>My Orders</Link>
    </>
  )}
  {user?.role === 'admin' && <Link to='/admin'>Admin Dashboard</Link>}
  <span className='nav-right'>
    {user ? (
      <>
        {user.name} ({user.role})
        <button className='secondary' onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
      </>
    )}
  </span>
</nav>
  );
}