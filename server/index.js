const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));

require('./routes/auth')(app);
require('./routes/player')(app);
require('./routes/tournament')(app);
require('./routes/shop')(app);
require('./routes/training')(app);
require('./routes/level')(app);

// Health check
app.get('/api', (req, res) => res.json({ status: 'API is live' }));

// Local server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Keep for Vercel compatibility