const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Show all products (web)
router.get('/products', async (req, res) => {
  const products = await Product.find().sort({ productName: 1 });
  res.render('products/index', { products });
});

// Render new product form
router.get('/products/new', (req, res) => {
  res.render('products/new', { product: {} });
});

// Create product (from form)
router.post('/products', async (req, res) => {
  const { productName, firmName, price, quantity, expiryDate } = req.body;
  try {
    const product = new Product({ productName, firmName, price, quantity, expiryDate });
    await product.save();
    res.redirect('/products');
  } catch (err) {
    res.render('products/new', { product: req.body, error: err.message });
  }
});

// Show one product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/products');
    res.render('products/show', { product });
  } catch (err) {
    res.redirect('/products');
  }
});

// Render edit form
router.get('/products/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/products');
    res.render('products/edit', { product });
  } catch (err) {
    res.redirect('/products');
  }
});

// Update product (via form using method-override)
router.put('/products/:id', async (req, res) => {
  try {
    const updates = req.body;
    await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product: { ...product.toObject(), ...req.body }, error: err.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (err) {
    res.redirect('/products');
  }
});

// Root redirect
router.get('/', (req, res) => {
  res.redirect('/products');
});

module.exports = router;
