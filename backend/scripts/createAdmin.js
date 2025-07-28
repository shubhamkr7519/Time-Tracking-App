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
    console.log('Connected to MongoDB Atlas');

    // 1. Check Admin User (skip if exists)
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (adminExists) {
      console.log('✅ Admin user already exists');
    } else {
      console.log('❌ Admin user not found - you may need to create it');
    }

    // 2. Check Default Team (skip if exists)
    const teamExists = await Team.findOne({ id: 'w7268578db3d0bc' });
    if (teamExists) {
      console.log('✅ Default team already exists');
    } else {
      console.log('❌ Default team not found - you may need to create it');
    }

    // 3. Create Default Shared Settings with correct structure
    const settingsExists = await SharedSettings.findOne({ id: 'wc28abfc4f50ccc' });
    if (!settingsExists) {
      const defaultSettings = await SharedSettings.create({
        id: 'wc28abfc4f50ccc',
        name: 'Default Personal Settings',
        organizationId: 'org123',
        type: 'personal',
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

    console.log('\n🎉 Shared settings setup complete!');
    
  } catch (error) {
    console.error('Error creating shared settings:', error);
    
    // More detailed error logging
    if (error.errors) {
      console.log('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`- ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

createInitialData();
