// scripts/createInitialData.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../src/models/User');
const Team = require('../src/models/Team');
const SharedSettings = require('../src/models/SharedSettings');

const createInitialData = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db.databaseName);

    // 1. Create Admin User (delete existing and recreate)
    console.log('\n🔧 Setting up Admin User...');
    
    // Delete existing admin if exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      await User.deleteOne({ email: 'admin@test.com' });
      console.log('🗑️  Deleted existing admin user');
    }

    // Create new admin user with proper password hashing
    console.log('🔨 Creating new admin user...');
    const adminUser = new User({
      id: 'admin_test_123',
      email: 'admin@test.com',
      password: 'Admin123!', // This will be hashed by the pre-save hook
      role: 'admin',
      organizationId: 'wbtmikjuiimvh3z',
      emailVerified: true,
      active: true,
      createdAt: Date.now()
    });

    await adminUser.save(); // This triggers password hashing
    console.log('✅ Admin user created successfully');
    console.log('   📧 Email: admin@test.com');
    console.log('   🔑 Password: Admin123!');
    console.log('   🔐 Password properly hashed in database');

    // 2. Create Default Team (skip if exists)
    console.log('\n🏢 Setting up Default Team...');
    const teamExists = await Team.findOne({ id: 'w7268578db3d0bc' });
    if (!teamExists) {
      const defaultTeam = await Team.create({
        id: 'w7268578db3d0bc',
        name: 'Default Team',
        description: 'Default team for organization',
        organizationId: 'wbtmikjuiimvh3z',
        ignoreProductive: false,
        ignoreNeutral: false,
        ignoreUnproductive: false,
        ignoreUnreviewed: false,
        default: true,
        employees: [],
        projects: [],
        createdAt: Date.now()
      });
      console.log('✅ Default team created:', defaultTeam.name);
    } else {
      console.log('✅ Default team already exists');
    }

    // 3. Create Default Shared Settings (skip if exists)
    console.log('\n⚙️  Setting up Default Shared Settings...');
    const settingsExists = await SharedSettings.findOne({ id: 'wc28abfc4f50ccc' });
    if (!settingsExists) {
      const defaultSettings = await SharedSettings.create({
        id: 'wc28abfc4f50ccc',
        name: 'Default Personal Settings',
        organizationId: 'wbtmikjuiimvh3z',
        type: 'personal',
        default: true,
        // Match the exact structure from the sample request
        settings: {
          type: 'manual',
          icon: true,
          timer: true,
          clocker: true,
          start: 2,
          idle: 1,
          breaks: 0,
          screenshots: 1,
          days: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
          },
          privileges: {
            apps: true,
            productivity: false,
            pm: false,
            screenshots: false,
            offline: false
          }
        },
        createdAt: Date.now()
      });
      console.log('✅ Default shared settings created:', defaultSettings.name);
    } else {
      console.log('✅ Default shared settings already exists');
    }

    // 4. Verify Admin Login Capability
    console.log('\n🔍 Verifying Admin Login...');
    const adminForTest = await User.findOne({ email: 'admin@test.com' }).select('+password');
    if (adminForTest) {
      const passwordTest = await adminForTest.comparePassword('Admin123!');
      if (passwordTest) {
        console.log('✅ Admin password verification successful');
        console.log('✅ Admin can login with: admin@test.com / Admin123!');
      } else {
        console.log('❌ Admin password verification failed');
        console.log('❌ There may be an issue with password hashing');
      }
    }

    console.log('\n🎉 Initial data setup complete!');
    console.log('\n📋 Summary:');
    console.log('   👤 Admin User: admin@test.com / Admin123!');
    console.log('   🏢 Default Team: w7268578db3d0bc');
    console.log('   ⚙️  Default Settings: wc28abfc4f50ccc');
    console.log('\n🚀 You can now login to your application!');
    
  } catch (error) {
    console.error('❌ Error creating initial data:', error);
    
    // More detailed error logging
    if (error.errors) {
      console.log('\n📝 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`);
      });
    }

    if (error.code === 11000) {
      console.log('\n🔄 Duplicate key error - some data may already exist');
      console.log('   This is usually safe to ignore');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
    process.exit(0);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n⚡ Process interrupted');
  await mongoose.disconnect();
  console.log('🔌 Database disconnected');
  process.exit(0);
});

process.on('unhandledRejection', async (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  await mongoose.disconnect();
  process.exit(1);
});

createInitialData();
