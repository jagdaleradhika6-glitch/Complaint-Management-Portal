const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Admin = require('../models/Admin');
const OtpVerification = require('../models/OtpVerification');
const sendEmail = require('../utils/sendEmail');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, department, phone } = req.body;
    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Email is reserved for admin use' });
    }

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        department,
        phone,
        isVerified: false
      });
    } else {
      user.name = name;
      user.password = hashedPassword;
      user.department = department || user.department;
      user.phone = phone || user.phone;
      await user.save();
    }

    const otp = generateOtp();
    await OtpVerification.deleteMany({ email: normalizedEmail, purpose: 'register' });
    await OtpVerification.create({
      email: normalizedEmail,
      otp,
      purpose: 'register',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendEmail({
      to: normalizedEmail,
      subject: 'Verify your complaint portal account',
      html: `<h2>Email Verification</h2><p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    });

    res.status(201).json({
      message: 'Registration successful. Verify OTP sent to email.',
      email: normalizedEmail
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();
    const record = await OtpVerification.findOne({ email: normalizedEmail, otp, purpose: 'register' });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();
    await OtpVerification.deleteMany({ email: normalizedEmail, purpose: 'register' });

    const token = generateToken({ id: user._id, role: 'user' });

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOtp();
    await OtpVerification.deleteMany({ email: normalizedEmail, purpose: 'register' });
    await OtpVerification.create({
      email: normalizedEmail,
      otp,
      purpose: 'register',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendEmail({
      to: normalizedEmail,
      subject: 'Your new OTP code',
      html: `<p>Your new OTP is <strong>${otp}</strong>.</p>`
    });

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Verify your email OTP before login' });
    }

    const token = generateToken({ id: user._id, role: 'user' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'user', department: user.department, phone: user.phone }
    });
  } catch (error) {
    next(error);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: admin._id, role: 'admin' });
    res.json({
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' }
    });
  } catch (error) {
    next(error);
  }
};
