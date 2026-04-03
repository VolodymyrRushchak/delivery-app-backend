const express = require('express');
const Shop = require('../schemas/shop');
const mongoose = require('mongoose');
const Product = require('../schemas/product');
const { handleServerError } = require('./utils');

const shopsRouter = express.Router();

shopsRouter.get('', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        handleServerError(error, res);
    }
});

shopsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await Shop.findById(id);
        if (!shop) return res.status(404).json({ message: 'The shop was not found.' });
        res.status(200).json(shop);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id')
            return res.status(400).json({ message: 'Wrong id format.' });
        handleServerError(error, res);
    }
    
});

shopsRouter.get('/:id/products', async (req, res) => {
    const { id } = req.params;
    try {
        const products = await Product.find({ shop: id });
        res.status(200).json(products);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === 'shop')
            return res.status(400).json({ message: 'Wrong shopId format.' });
        handleServerError(error, res);
    }
});

module.exports = shopsRouter;