const express = require('express');
const router = express.Router();
const userRouter = require('./user.js');
const formRouter = require('./form.js');

// Root route for the index router
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// Mount user and form routes
router.use('/user', userRouter);
router.use('/form', formRouter);

// 404 Handling for undefined sub-routes
router.use((req, res) => {
  res.status(404).json({ error: 'Route not found in index router' });
});

module.exports = router;
