const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../src/models/User');

const createProductionAdmin = async () => {
  try {
    // Use the exact same connection string as your production backend
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas (Production)');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      const admin = await User.create({
        id: 'admin123',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        organizationId: 'org123',
        emailVerified: true,
        active: true,
        createdAt: Date.now()
      });
      console.log('✅ Admin user created:', admin.email);
    }

    // List all users to verify
    const allUsers = await User.find({});
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ID: ${user.id}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createProductionAdmin();
