const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        count: {
            type: Number,
            min: 1,
            default: 1,
        }
    }, 
    { 
        _id: false
    }
);

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    address:  {
        type: String,
        required: true
    },
    products: {
        type: [ orderProductSchema ],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

orderSchema.index({ email: 1, phone: 1, date: 1 });

module.exports = mongoose.model('Order', orderSchema);