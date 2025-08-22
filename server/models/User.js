const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '🧸' },
  bio: { type: String, default: '' },
}, { timestamps: true });

// Password hashing before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    console.log(`🔄 Password not modified for user: ${this.email}, skipping hash`);
    return next();
  }

  console.log(`🔐 Hashing password for user: ${this.email}`);
  console.log(`🔑 Original password length: ${this.password ? this.password.length : 'undefined'}`);

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    console.log(`✅ Password hashed successfully, length: ${hashedPassword.length}`);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error(`❌ Password hashing failed for user: ${this.email}`, error);
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
