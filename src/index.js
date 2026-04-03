const express = require('express');
const cors = require('cors');
const shopsRouter = require('./api/shops');
const productsRouter = require('./api/products');
const ordersRouter = require('./api/orders');
require('./database');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/shops', shopsRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));