const express = require('express');
const Order = require('../schemas/order');
const { handleServerError } = require('./utils');

const ordersRouter = express.Router();

const validateOrder = (order) => {
    const { name, email, phone, address, products } = order;
    if (!name || typeof name !== 'string' || name.length < 2)
        return 'Invalid name';
    if (!email || typeof email !== 'string')
        return 'Invalid email';
    if (!phone || typeof phone !== 'string')
        return 'Invalid phone';
    if (!address || typeof address !== 'string')
        return 'Invalid address';
    if (!products || !Array.isArray(products) || !products.length)
        return 'Invalid products array';
    for (const product of products) {
        const { count, product: id } = product;
        if (!count || typeof count !== 'number' || count < 1)
            return `Invalid product count: ${count}`;
        const regex = /^[0-9a-fA-F]{24}$/;
        if (!id || typeof id !== 'string' || !regex.test(id))
            return 'Invalid product id';
    }
    return null;
};

ordersRouter.post('', async (req, res) => {
    const order = req.body;
    const errorMessage = validateOrder(order);
    if (errorMessage) return res.status(400).json({ message: errorMessage });
    try {
       const newOrder = new Order(order);
       await newOrder.save();
       res.status(201).json(newOrder);
    } catch (error) {
        handleServerError(error, res);
    }
});

module.exports = ordersRouter;