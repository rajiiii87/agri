const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product'); // Import the Product model

const router = express.Router();

// Ensure 'uploads/' exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to add a product with an image
router.post('/add_product', upload.single('image'), async (req, res) => {
  try {
    console.log("Received Product Data:", req.body);
    console.log("Uploaded File:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'Image upload failed' });
    }

    const image = `http://192.168.1.17:5000/uploads/${req.file.filename}`;
    
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: image,
      farmerName: req.body.farmerName,
      farmerLocation: req.body.farmerLocation,
      farmerId: req.body.farmerId,
    });

    const savedProduct = await newProduct.save();
    res.status(200).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// Route to get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Route to update a product
router.put('/update_product/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? `http://192.168.1.17:5000/uploads/${req.file.filename}` : undefined;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Route to delete a product
router.delete('/delete_product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the associated image file
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(product.image));
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });
    }

    res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
