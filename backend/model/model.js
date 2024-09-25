import mongoose from 'mongoose';
import User from './user.js';
import Event from './event.js';

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
};

const models = {User, Event};

export {connectDb};

export default models;