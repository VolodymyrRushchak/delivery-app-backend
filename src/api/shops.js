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
        if (!shop) return shopNotFound(res);
        res.status(200).json(shop);
    } catch (error) {
        handleShopError(error, res);
    }
    
});

shopsRouter.get('/:id/products', async (req, res) => {
    const { id } = req.params;
    let { categories, sort, skip, take } = req.query;
    try {
        if (!(await shopExists(id)))
            return shopNotFound(res);
        const filter = { shop: id };
        if (validCategories(categories))
            filter.category = { $in: categories };
        let query = Product.find(filter);

        if (sort === 'by-price-asc') query.sort({ price: 1 });
        else if (sort === 'by-price-desc') query.sort({ price: -1 });
        else if (sort === 'by-name') query.sort({ name: 1 });

        take = +take;
        skip = +skip;
        if (Number.isInteger(take) && Number.isInteger(skip))
            query.skip(skip).limit(take);

        const products = await query.exec();
        res.status(200).json(products);
    } catch (error) {
        handleShopError(error, res);
    }
});

shopsRouter.get('/:id/product-count', async (req, res) => {
    const { id } = req.params;
    const { categories } = req.query;
    try {
        if (!(await shopExists(id)))
            return shopNotFound(res);
        const filter = { shop: id };
        if (validCategories(categories))
            filter.category = { $in: categories };
        const count = await Product.countDocuments(filter); 
        res.status(200).json({ count });
    } catch (error) {
        handleShopError(error, res);
    }
});

function handleShopError(error, res) {
    if (error instanceof mongoose.Error.CastError) {
        if (error.path === '_id') 
            return res.status(400).json({ message: 'Wrong id format.' });
        if (error.path === 'shop')
            return res.status(400).json({ message: 'Wrong shop id format.' });
    }
    handleServerError(error, res);
}

async function shopExists(id) {
    const shop = await Shop.findById(id);
    return shop ? true : false;
}

function shopNotFound(res) {
    res.status(404).json({ message: 'The shop was not found.' });
}

function validCategories(categories) {
    return typeof categories === 'string' || (Array.isArray(categories) && categories.length);
}

module.exports = shopsRouter;