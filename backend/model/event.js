import mongoose from 'mongoose';

// Event Schema
const eventSchema = new mongoose.Schema({
url: String,
theatreName: String,
notified: { type: Boolean, default: false },
subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Keep track of users subscribed to this event
});
  
const Event = mongoose.model('Event', eventSchema);

export default Event;
