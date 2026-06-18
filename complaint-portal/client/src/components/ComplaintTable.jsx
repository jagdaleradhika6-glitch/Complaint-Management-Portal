import { useState } from 'react';
import StatusBadge from './common/StatusBadge';

const ComplaintTable = ({ complaints, isAdmin = false, onUpdate, onDelete, onHistory }) => {
  const [drafts, setDrafts] = useState({});

  const updateDraft = (id, key, value) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Category</th>
            <th className="px-3 py-3">Priority</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Department</th>
            {isAdmin ? <th className="px-3 py-3">Student</th> : null}
            {isAdmin ? <th className="px-3 py-3">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 8 : 6} className="px-3 py-8 text-center text-slate-500">
                No complaints found.
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint._id} className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-4">
                  <p className="font-medium">{complaint.title}</p>
                  <p className="mt-1 max-w-xs text-xs text-slate-500">{complaint.description}</p>
                </td>
                <td className="px-3 py-4">{complaint.category}</td>
                <td className="px-3 py-4">{complaint.priority}</td>
                <td className="px-3 py-4">{new Date(complaint.complaintDate).toLocaleDateString()}</td>
                <td className="px-3 py-4"><StatusBadge status={complaint.status} /></td>
                <td className="px-3 py-4">
                  {isAdmin ? (
                    <input
                      className="input-field min-w-32"
                      placeholder="Department"
                      value={drafts[complaint._id]?.department ?? complaint.department}
                      onChange={(e) => updateDraft(complaint._id, 'department', e.target.value)}
                    />
                  ) : (
                    complaint.department
                  )}
                </td>
                {isAdmin ? <td className="px-3 py-4">{complaint.user?.name}<div className="text-xs text-slate-500">{complaint.user?.email}</div></td> : null}
                {isAdmin ? (
                  <td className="space-y-2 px-3 py-4">
                    <select
                      className="input-field"
                      value={drafts[complaint._id]?.status ?? complaint.status}
                      onChange={(e) => updateDraft(complaint._id, 'status', e.target.value)}
                    >
                      {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <textarea
                      className="input-field min-h-20"
                      placeholder="Remark"
                      value={drafts[complaint._id]?.remark ?? ''}
                      onChange={(e) => updateDraft(complaint._id, 'remark', e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-primary" onClick={() => onUpdate(complaint._id, drafts[complaint._id] || {})} type="button">
                        Save
                      </button>
                      <button className="btn-secondary" onClick={() => onHistory(complaint._id)} type="button">
                        History
                      </button>
                      <button className="rounded-xl bg-rose-600 px-4 py-2 font-medium text-white" onClick={() => onDelete(complaint._id)} type="button">
                        Delete
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
