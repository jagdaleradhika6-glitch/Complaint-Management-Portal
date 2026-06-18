const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(auth, allowRoles('admin'));
router.get('/stats', adminController.getDashboardStats);
router.get('/complaints', adminController.getAllComplaints);
router.put('/complaints/:id', adminController.updateComplaint);
router.get('/complaints/:id/history', adminController.getComplaintHistory);
router.delete('/complaints/:id', adminController.deleteComplaint);

module.exports = router;
