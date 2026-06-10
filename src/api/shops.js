const express = require('express');
const Shop = require('../schemas/shop');
const mongoose = require('mongoose');
const Product = require('../schemas/product');
const { handleServerError, sendMessage } = require('./utils');

const shopsRouter = express.Router();

shopsRouter.get('', async (req, res) => {
    try {
        const shops = await Shop.find().lean();
        res.status(200).json(shops);
    } catch (error) {
        handleServerError(error, res);
    }
});

shopsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await Shop.findById(id).lean();
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
        let query = Product.find(filter).lean();

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
   if (handleCastError(error, res)) return;
    handleServerError(error, res);
}

async function shopExists(id) {
    const shop = await Shop.findById(id).lean();
    return shop ? true : false;
}

function shopNotFound(res) {
    sendMessage(res, 'The shop was not found.', 404);
}

function validCategories(categories) {
    return typeof categories === 'string' || (Array.isArray(categories) && categories.length);
}

module.exports = shopsRouter;