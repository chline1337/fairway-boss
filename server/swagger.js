// server/swagger.js
const path = require('path');
const YAML = require('yamljs');

// Load your single openapi.yaml file
const swaggerDocument = YAML.load(
    path.join(__dirname, 'docs', 'openapi.yaml')
);

module.exports = swaggerDocument;
