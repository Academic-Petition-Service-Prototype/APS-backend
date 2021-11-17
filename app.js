const express = require('express');
const cors = require('cors');

//import routes
const authentication = require('./routes/authentication.routes');
const users = require('./routes/users.routes');

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
app.use('/api/users', verifyToken,users);

module.exports = app;