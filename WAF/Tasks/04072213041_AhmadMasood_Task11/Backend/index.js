const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');

const productRoutes = require('./routes/productRoutes');
dotenv.config();
const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

app.use(logger);
app.use(rateLimiter);

  
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.log(err));


app.use('/db/products', productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
