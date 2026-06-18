const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, priority, complaintDate } = req.body;
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      complaintDate,
      user: req.user._id,
      history: [
        {
          action: 'Complaint submitted',
          status: 'Pending',
          by: req.user.name,
          comment: 'Complaint created by student',
          department: 'Unassigned'
        }
      ]
    });

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    next(error);
  }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = '', date = '' } = req.query;
    const query = { user: req.user._id };

    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.complaintDate = { $gte: start, $lt: end };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [complaints, total] = await Promise.all([
      Complaint.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
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

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user._id });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};
