const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalComplaints, pendingComplaints, resolvedComplaints, activeUsers, complaintsByStatus, complaintsByCategory] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      User.countDocuments({ isVerified: true }),
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
    ]);

    res.json({ totalComplaints, pendingComplaints, resolvedComplaints, activeUsers, complaintsByStatus, complaintsByCategory });
  } catch (error) {
    next(error);
  }
};

exports.getAllComplaints = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = '', department = '', date = '' } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (status) query.status = status;
    if (department) query.department = department;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.complaintDate = { $gte: start, $lt: end };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [complaints, total] = await Promise.all([
      Complaint.find(query).populate('user', 'name email department').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Complaint.countDocuments(query)
    ]);

    res.json({
      complaints,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    const { status, department, remark } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (department) complaint.department = department;
    if (remark) complaint.remarks.push(remark);

    complaint.history.push({
      action: 'Complaint updated',
      status: complaint.status,
      by: req.user.name,
      comment: remark || 'Complaint updated by admin',
      department: complaint.department
    });

    await complaint.save();

    await sendEmail({
      to: complaint.user.email,
      subject: 'Complaint status updated',
      html: `
        <h2>Complaint Update</h2>
        <p>Your complaint <strong>${complaint.title}</strong> is now <strong>${complaint.status}</strong>.</p>
        <p>Department: ${complaint.department}</p>
        <p>Remark: ${remark || 'No additional remarks'}</p>
      `
    });

    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    next(error);
  }
};

exports.getComplaintHistory = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ history: complaint.history, complaint });
  } catch (error) {
    next(error);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};
