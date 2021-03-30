var app = require('./src/app');
var serverless = require('serverless-http');

module.exports.handler = serverless(app);
