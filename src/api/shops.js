const express = require('express');
const Shop = require('../schemas/shop');

const shopsRouter = express.Router();

shopsRouter.get('', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

module.exports = shopsRouter;