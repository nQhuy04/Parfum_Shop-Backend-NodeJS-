
require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const run = async () => {
  try {
    await connectDB();
    const email = 'admin@gmail.com';
    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log('Admin exists — role updated to admin:', email);
      process.exit(0);
    }
    const hash = await bcrypt.hash('123456', 10);
    const admin = await User.create({
      name: 'Admin Huy',
      email,
      password: hash,
      role: 'admin'
    });
    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Seed admin error:', err);
    process.exit(1);
  }
};

run();
