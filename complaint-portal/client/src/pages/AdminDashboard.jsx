import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ComplaintTable from '../components/ComplaintTable';
import StatsCharts from '../components/charts/StatsCharts';
import Pagination from '../components/common/Pagination';
import StatCard from '../components/common/StatCard';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { exportComplaintsToExcel, exportComplaintsToPDF } from '../utils/export';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', status: '', department: '', date: '', page: 1 });
  const [historyModal, setHistoryModal] = useState(null);

  const fetchStats = async () => {
    const { data } = await api.get('/admin/stats');
    setStats(data);
  };

  const fetchComplaints = async (customFilters = filters) => {
    const { data } = await api.get('/admin/complaints', { params: customFilters });
    setComplaints(data.complaints);
    setPagination(data.pagination);
  };

  useEffect(() => {
    fetchStats();
    fetchComplaints();
  }, [filters.page]);

  const applyFilters = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchComplaints({ ...filters, page: 1 });
  };

  const updateComplaint = async (id, updates) => {
    try {
      await api.put(`/admin/complaints/${id}`, updates);
      toast.success('Complaint updated');
      fetchComplaints();
      fetchStats();
    } catch {
      toast.error('Update failed');
    }
  };

  const deleteComplaint = async (id) => {
    try {
      await api.delete(`/admin/complaints/${id}`);
      toast.success('Complaint deleted');
      fetchComplaints();
      fetchStats();
    } catch {
      toast.error('Delete failed');
    }
  };

  const showHistory = async (id) => {
    try {
      const { data } = await api.get(`/admin/complaints/${id}/history`);
      setHistoryModal(data);
    } catch {
      toast.error('Unable to load history');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white md:flex-row md:items-center dark:bg-slate-800">
          <div>
            <p className="text-sm opacity-80">Administrator Panel</p>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="mt-2 text-sm opacity-90">Monitor complaints, assign departments, and resolve issues efficiently.</p>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            <button className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-900" onClick={logout} type="button">Logout</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Complaints" value={stats.totalComplaints || 0} />
          <StatCard title="Pending Complaints" value={stats.pendingComplaints || 0} />
          <StatCard title="Resolved Complaints" value={stats.resolvedComplaints || 0} />
          <StatCard title="Active Users" value={stats.activeUsers || 0} />
        </div>

        <StatsCharts statusData={stats.complaintsByStatus} categoryData={stats.complaintsByCategory} />

        <div className="card grid gap-4 md:grid-cols-5">
          <input className="input-field" placeholder="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <input className="input-field" placeholder="Department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
          <select className="input-field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {['Academic', 'Hostel', 'Transport', 'Infrastructure', 'Library', 'Examination', 'Other'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input-field" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="input-field" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          <div className="md:col-span-5 flex flex-wrap justify-between gap-3">
            <div className="flex gap-3">
              <button className="btn-primary" onClick={applyFilters} type="button">Apply Filters</button>
              <button className="btn-secondary" onClick={() => exportComplaintsToExcel(complaints)} type="button">Export Excel</button>
              <button className="btn-secondary" onClick={() => exportComplaintsToPDF(complaints)} type="button">Export PDF</button>
            </div>
          </div>
        </div>

        <ComplaintTable complaints={complaints} isAdmin onUpdate={updateComplaint} onDelete={deleteComplaint} onHistory={showHistory} />
        <Pagination pagination={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

        {historyModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
            <div className="card max-h-[80vh] w-full max-w-2xl overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Complaint History</h3>
                <button className="btn-secondary" onClick={() => setHistoryModal(null)} type="button">Close</button>
              </div>
              <div className="space-y-3">
                {historyModal.history.map((item, index) => (
                  <div key={`${item.createdAt}-${index}`} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="font-semibold">{item.action}</p>
                    <p className="text-sm text-slate-500">Status: {item.status} • Department: {item.department}</p>
                    <p className="text-sm text-slate-500">By: {item.by}</p>
                    <p className="mt-2 text-sm">{item.comment}</p>
                    <p className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
