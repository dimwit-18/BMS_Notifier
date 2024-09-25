import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
  });

const User = mongoose.model('User', userSchema);

export default User;