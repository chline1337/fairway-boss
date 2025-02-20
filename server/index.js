const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: '*' })); // Wildcard for now—tighten later

require('./routes/auth')(app);
require('./routes/player')(app);
require('./routes/tournament')(app);
require('./routes/shop')(app);
require('./routes/training')(app);
require('./routes/level')(app);

module.exports = app; // Vercel serverless export