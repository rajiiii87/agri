const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// ✅ Get all favorite products for a customer
router.get('/:customerId', async (req, res) => {
    try {
        const favorites = await Favorite.find({ customerId: req.params.customerId }).populate('productId');
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch favorite products' });
    }
});

// ✅ Add a product to favorites
router.post('/add', async (req, res) => {
    try {
        const { customerId, productId } = req.body;
        const newFavorite = new Favorite({ customerId, productId });
        await newFavorite.save();
        res.json({ message: 'Product added to favorites' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add product to favorites' });
    }
});

// ✅ Remove a product from favorites
router.post('/remove', async (req, res) => {
    try {
        const { customerId, productId } = req.body;
        await Favorite.findOneAndDelete({ customerId, productId });
        res.json({ message: 'Product removed from favorites' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove product from favorites' });
    }
});

module.exports = router;
