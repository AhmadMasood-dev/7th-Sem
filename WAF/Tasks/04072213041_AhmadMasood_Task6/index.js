const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');

const fileTaskRoutes = require('./routes/fileTaskRoutes');
const dbTaskRoutes = require('./routes/dbTaskRoutes');
dotenv.config();
const app = express();
app.use(express.json());

app.use(logger);
app.use(rateLimiter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.log(err));

app.use('/file/tasks', fileTaskRoutes);
app.use('/db/tasks', dbTaskRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
