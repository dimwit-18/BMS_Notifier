import dotenv from 'dotenv';
dotenv.config();
const mongoString = process.env.DATABASE_URL

import express from 'express';
import cors from "cors";
import routes from './routes/routes.js';
import model from './model/model.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import checkAllEvents from './checkAllEvents.js';

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.listen(port, () => {
    console.log(`serving at http://localhost:${port}`);
    setInterval(checkAllEvents, 1 * 15 * 1000);
})