import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintTable from '../components/ComplaintTable';
import Pagination from '../components/common/Pagination';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import ProfilePage from './ProfilePage';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', status: '', date: '', page: 1 });

  const fetchComplaints = async (customFilters = filters) => {
    try {
      const { data } = await api.get('/complaints', { params: customFilters });
      setComplaints(data.complaints);
      setPagination(data.pagination);
    } catch {
      toast.error('Unable to load complaints');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters.page]);

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      await api.post('/complaints', payload);
      toast.success('Complaint submitted');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchComplaints({ ...filters, page: 1 });
  };

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 p-6 text-white md:flex-row md:items-center">
          <div>
            <p className="text-sm opacity-80">Welcome back</p>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="mt-2 text-sm opacity-90">Create, search, and track your complaints in real time.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ThemeToggle />
            <button className="rounded-xl bg-white px-4 py-2 font-semibold text-brand-700" onClick={logout} type="button">Logout</button>
          </div>
        </div>

        <ComplaintForm onSubmit={handleSubmit} loading={loading} />

        <div className="card grid gap-4 md:grid-cols-4">
          <input className="input-field" placeholder="Search by title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="input-field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {['Academic', 'Hostel', 'Transport', 'Infrastructure', 'Library', 'Examination', 'Other'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input-field" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="input-field" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          <div className="md:col-span-4 flex justify-end">
            <button className="btn-primary" onClick={applyFilters} type="button">Apply Filters</button>
          </div>
        </div>

        <ComplaintTable complaints={complaints} />
        <Pagination pagination={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
        <ProfilePage />
      </div>
    </div>
  );
};

export default UserDashboard;
