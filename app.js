const express = require('express');
const cors = require('cors');

//import routes
const authentication = require('./routes/authentication.routes');
const users = require('./routes/users.routes');
const groups = require('./routes/groups.routes');
const reports = require('./routes/reports.routes');

// middleware
const verifyToken = require('./middleware/authentication.middleware');

// Create app
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.disable('x-powered-by');

// CORS
app.use(cors());

// Router
app.use('/api', authentication);
// app.use('/api/users', verifyToken,users);
app.use('/api',users);
app.use('/api',groups);
app.use('/api',reports);

module.exports = app;