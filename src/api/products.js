const express = require('express');
const Product = require('../schemas/product');

const productsRouter = express.Router();

productsRouter.get('', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

module.exports = productsRouter;