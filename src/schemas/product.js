const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
        index: true
    },
    category: {
        type: String, 
        minLength: 2,
        maxLength: 50,
        required: true,
        index: true
    },
    picture: string
});

module.exports = mongoose.model('Product', productSchema);