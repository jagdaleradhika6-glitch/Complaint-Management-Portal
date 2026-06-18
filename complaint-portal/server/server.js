const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const Admin = require('./models/Admin');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ message: 'Complaint portal API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

const ensureDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@college.com';
  const existing = await Admin.findOne({ email });
  if (!existing) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await Admin.create({ name: 'Super Admin', email, password });
    console.log(`Default admin created: ${email}`);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await ensureDefaultAdmin();
  console.log(`Server running on port ${PORT}`);
});
