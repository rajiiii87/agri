const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
// Add this to your server.js
const orderRoutes = require('./routes/orderRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://192.168.1.17:5000', // Update based on where your Flutter app runs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Serve Static Files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
// Default Route
app.get('/', (req, res) => {
    res.send('🚀 Server is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://192.168.1.17::${PORT}`);
});
