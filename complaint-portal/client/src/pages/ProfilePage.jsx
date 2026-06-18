import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ProfilePage = () => {
  const [form, setForm] = useState({ name: '', email: '', department: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await api.get('/users/profile');
      setForm({ name: data.name || '', email: data.email || '', department: data.department || '', phone: data.phone || '' });
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await api.put('/users/profile', form);
      toast.success('Profile updated');
    } catch {
      toast.error('Unable to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Profile Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input-field" value={form.email} disabled />
        </div>
        <div>
          <label className="label">Department</label>
          <input className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" disabled={loading} type="submit">{loading ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  );
};

export default ProfilePage;
