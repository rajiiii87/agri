const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
