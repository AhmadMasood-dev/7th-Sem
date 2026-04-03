const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs= require('fs')
const Product = require('./models/product.js');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB Atlas');
  saveToDatabase()
}).catch(err => console.log(err));

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const saveToDatabase = async () => {
    const count = await Product.countDocuments();
    if (count === 0) {
        const rawData = fs.readFileSync('productsInformation.json', 'utf-8');
        const jsonData = JSON.parse(rawData);

        await Product.insertMany(jsonData);
    } else {
        console.log(" Products already exist in the Mongodb Atlas");
    }
};