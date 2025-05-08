// controllers/cartController.js
const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.addToCart = async (req, res) => {
  try {
    // 1. Add to cart
    const cartItem = new Cart(req.body);
    await cartItem.save();
    
    // 2. Get product details
    const product = await Product.findById(req.body.productId);
    
    // 3. Create order for farmer
    const order = new Order({
      farmerId: product.farmerId,
      productId: product._id,
      customerId: req.body.customerId,
      productName: product.name,
      price: product.price,
      quantity: req.body.quantity || 1
    });
    await order.save();
    
    res.status(201).json({
      message: "Added to cart and order created",
      cartItem,
      order
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};