const express = require('express');
const cors = require('cors');

//import routes
const authentication = require('./routes/authentication.routes');
const users = require('./routes/users.routes');
const agency = require('./routes/agency.routes');
const reports = require('./routes/reports.routes');
const forms = require('./routes/forms.routes');
const submitforms = require('./routes/submitforms.routes');
const requests = require('./routes/requests.routes');
const tags = require('./routes/tags.routes');

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
app.use('/api',agency);
app.use('/api',reports);
app.use('/api',forms);
app.use('/api',submitforms);
app.use('/api',requests);
app.use('/api',tags);

module.exports = app;