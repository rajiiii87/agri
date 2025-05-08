// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get orders by farmerId
router.get('/:farmerId', async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.params.farmerId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.put('/:orderId', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;