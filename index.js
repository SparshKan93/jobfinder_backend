require("dotenv").config();
const connectToMongo = require('./database');
const express = require('express');

// Connect to MongoDB and start the Express app after successful connection
connectToMongo()
  .then(() => {
    const app = express();
    const port = 3001;

    app.use(express.json())

    // Available Routes
    app.use('/api/auth', require('./routes/auth'))
    app.use('/api/posts', require('./routes/posts'))
    app.use('/api/admin', require('./routes/admin'))

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });
