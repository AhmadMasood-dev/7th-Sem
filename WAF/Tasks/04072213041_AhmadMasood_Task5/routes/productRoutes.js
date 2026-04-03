const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// 1. Fetch all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 2. Fetch products with price range
router.get('/price-range', async (req, res) => {
  const { min, max, name } = req.query;
  const filter = {
    Price: { $gte: parseInt(min), $lte: parseInt(max) }
  };
  if (name) filter.ProductName = name;
  const products = await Product.find(filter);
  res.json(products);
});

// 3. Fetch expired products
router.get('/expired', async (req, res) => {
  const today = new Date();
  const products = await Product.find({ ExpiryDate: { $lt: today } });
  res.json(products);
});

// 4. Fetch products with quantity less than 50
router.get('/low-stock', async (req, res) => {
  const products = await Product.find({ Quantity: { $lt: 50 } });
  res.json(products);
});

// 5. Fetch products of certain firms
router.get('/by-firm', async (req, res) => {
  const { firm } = req.query;
  const products = await Product.find({ FirmName: firm });
  res.json(products);
});

// 6. Delete expired products
router.delete('/delete-expired', async (req, res) => {
  const today = new Date();
  const result = await Product.deleteMany({ ExpiryDate: { $lt: today } });
  res.json({ deletedCount: result.deletedCount });
});

// 7. Update price of a product from a specific firm
router.put('/update-price', async (req, res) => {
  const { firm, name, newPrice } = req.body;
  const result = await Product.updateMany(
    { FirmName: firm, ProductName: name },
    { $set: { Price: newPrice } }
  );
  res.json({ updatedCount: result.modifiedCount });
});

module.exports = router;
