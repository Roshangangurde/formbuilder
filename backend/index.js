const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db.js');
const { incomingRequestLogger } = require('./middleware');
const indexRouter = require('./routes/index');
const bodyParser = require("body-parser");

dotenv.config(); // Load environment variables

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGOOSE_URI_STRING;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.urlencoded({ extended: true })); // Body parser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(incomingRequestLogger);

// Routes
app.use('/api/v1', indexRouter);

// Error Handling
app.use((req, res, next) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB(MONGODB_URI); // Connect to the database
});
