import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compare plaintext passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return enteredPassword === this.password;
};

export default mongoose.model('User', userSchema);
