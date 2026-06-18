import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ThemeToggle from '../components/common/ThemeToggle';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('pending_email', data.email);
      toast.success(data.message);
      navigate('/verify-otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-sky-100 px-4 py-10 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl justify-end"><ThemeToggle /></div>
      <div className="mx-auto mt-6 grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="mb-3 inline-flex w-fit rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-brand-700 dark:bg-slate-900/70">College Complaint Management</p>
          <h1 className="text-4xl font-bold leading-tight">Resolve student issues faster with a modern complaint portal.</h1>
          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300">Track complaints, route them to departments, notify students automatically, and monitor resolution performance in one place.</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="text-2xl font-bold">Create account</h2>
          <div>
            <label className="label">Full name</label>
            <input className="input-field" name="name" onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" name="email" type="email" onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input-field" name="password" type="password" onChange={handleChange} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Department</label>
              <input className="input-field" name="department" onChange={handleChange} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input-field" name="phone" onChange={handleChange} />
            </div>
          </div>
          <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Please wait...' : 'Register & Send OTP'}</button>
          <p className="text-sm text-slate-500">Already have an account? <Link className="font-semibold text-brand-600" to="/login">Login</Link></p>
          <p className="text-sm text-slate-500">Admin access? <Link className="font-semibold text-brand-600" to="/admin-login">Admin login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
