import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

const LoginPage = ({ admin = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const endpoint = admin ? '/auth/admin/login' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      login(data);
      toast.success('Login successful');
      navigate(admin ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">{admin ? 'Admin Login' : 'Student Login'}</h1>
        <div>
          <label className="label">Email</label>
          <input className="input-field" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input-field" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
        <div className="text-sm text-slate-500">
          {!admin ? <Link className="font-semibold text-brand-600" to="/verify-otp">Verify OTP</Link> : null}
          <div className="mt-2"><Link className="font-semibold text-brand-600" to={admin ? '/login' : '/'}>{admin ? 'Student login' : 'Create account'}</Link></div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
