const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  firmName: String,
  price: Number,
  quantity: Number,
  expiryDate: Date
});

module.exports = mongoose.model('Product', productSchema);
