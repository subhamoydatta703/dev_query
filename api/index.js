// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment

const app = require('../backend/server.js');

module.exports = app;
