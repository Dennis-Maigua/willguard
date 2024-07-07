const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const willRoutes = require('./routes/will');

const port = process.env.PORT || 8000;

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('DB is connected successfully'))
    .catch(err => console.log(err));

// app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', willRoutes);

app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});