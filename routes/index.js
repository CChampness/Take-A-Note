const express = require('express');

// Import modular router
const notesRouter = require('./notes');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;
