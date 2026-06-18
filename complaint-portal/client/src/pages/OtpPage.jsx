import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OtpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(localStorage.getItem('pending_email') || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      login(data);
      toast.success('Email verified');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('OTP resent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to resend OTP');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={verifyOtp} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Verify Email OTP</h1>
        <div>
          <label className="label">Email</label>
          <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">OTP</label>
          <input className="input-field" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
        </div>
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Verifying...' : 'Verify OTP'}</button>
        <button className="btn-secondary w-full" onClick={resendOtp} type="button">Resend OTP</button>
      </form>
    </div>
  );
};

export default OtpPage;
