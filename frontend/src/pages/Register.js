import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Create client account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder='Name' required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <br /><br />
        <input type='email' placeholder='Email' required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <br /><br />
        <input type='password' placeholder='Password (min 6 chars)' required minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <br /><br />
        <button type='submit'>Register</button>
      </form>
      <p>Already registered? <Link to='/login'>Login</Link></p>
    </div>
  );
}