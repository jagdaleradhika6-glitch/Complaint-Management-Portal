const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

router.use(auth, allowRoles('user'));
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('priority').notEmpty().withMessage('Priority is required'),
    body('complaintDate').notEmpty().withMessage('Date is required')
  ],
  complaintController.createComplaint
);
router.get('/', complaintController.getMyComplaints);
router.get('/:id', complaintController.getComplaintById);

module.exports = router;
