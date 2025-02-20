const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

require('./routes/auth')(app);
require('./routes/player')(app);
require('./routes/tournament')(app);
require('./routes/shop')(app);
require('./routes/training')(app);
require('./routes/level')(app);

app.listen(5000, () => console.log('Server running on port 5000'));