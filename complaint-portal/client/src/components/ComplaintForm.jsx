import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  category: 'Academic',
  priority: 'Medium',
  complaintDate: new Date().toISOString().split('T')[0]
};

const ComplaintForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form className="card space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Complaint title</label>
        <input className="input-field" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input-field min-h-28" name="description" value={form.description} onChange={handleChange} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="label">Category</label>
          <select className="input-field" name="category" value={form.category} onChange={handleChange}>
            {['Academic', 'Hostel', 'Transport', 'Infrastructure', 'Library', 'Examination', 'Other'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input-field" name="priority" value={form.priority} onChange={handleChange}>
            {['Low', 'Medium', 'High', 'Critical'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Date</label>
          <input className="input-field" type="date" name="complaintDate" value={form.complaintDate} onChange={handleChange} />
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ComplaintForm;
