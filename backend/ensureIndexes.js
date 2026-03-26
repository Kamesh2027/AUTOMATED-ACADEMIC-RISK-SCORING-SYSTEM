// This script ensures indexes for User and Student collections for optimal login speed.
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aarss';

async function ensureIndexes() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('User email index ensured');

    await Student.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Student email index ensured');

    await Student.collection.createIndex({ regNo: 1 }, { unique: true });
    console.log('Student regNo index ensured');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error ensuring indexes:', err);
    process.exit(1);
  }
}

ensureIndexes();
