const express = require('express');
const Product = require('../schemas/product');
const { handleServerError } = require('./utils');

const productsRouter = express.Router();

productsRouter.get('', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        handleServerError(error, res);
    }
});

module.exports = productsRouter;