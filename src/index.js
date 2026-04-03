const express = require('express');
const shopsRouter = require('./api/shops');
const productsRouter = require('./api/products');
require('./database');

const app = express();

app.use('/shops', shopsRouter);
app.use('/products', productsRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));