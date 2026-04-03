const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs');
const methodOverride = require('method-override');
const path = require('path');
const Product = require('./models/product.js');
const expressLayouts = require('express-ejs-layouts');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');

dotenv.config();

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger);
app.use(rateLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB Atlas');
  saveToDatabase();
}).catch(err => console.log(err));

// API routes (JSON) and web routes (EJS)
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const webProductRoutes = require('./routes/webProductRoutes');
app.use('/', webProductRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Seed DB: normalize fields from productsInformation.json to model shape
const saveToDatabase = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const rawData = fs.readFileSync(path.join(__dirname, 'productsInformation.json'), 'utf-8');
    const jsonData = JSON.parse(rawData);

    const normalized = jsonData.map(item => ({
      productName: item.productName || item.ProductName || item.name,
      firmName: item.firmName || item.FirmName || item.firm || item.Firm || '',
      price: item.price || item.prize || item.Price || 0,
      quantity: item.quantity || item.Quantity || 0,
      expiryDate: item.expiryDate || item.ExpiryDate || null
    }));

    await Product.insertMany(normalized);
    console.log('Seeded products into MongoDB');
  } else {
    console.log('Products already exist in MongoDB Atlas');
  }
};