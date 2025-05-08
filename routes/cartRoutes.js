const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// ✅ Get all cart items for a customer
router.get('/:customerId', async (req, res) => {
    try {
        const cartItems = await Cart.find({ customerId: req.params.customerId }).populate('productId');
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});

// ✅ Add a product to the cart
router.post('/', async (req, res) => {
    try {
        const { customerId, productId } = req.body;
        const newCartItem = new Cart({ customerId, productId });
        await newCartItem.save();
        res.json({ message: 'Product added to cart' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});

// ✅ Remove a product from the cart
router.delete('/remove', async (req, res) => {
    try {
        const { customerId, productId } = req.body;
        await Cart.findOneAndDelete({ customerId, productId });
        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove product from cart' });
    }
});

module.exports = router;
