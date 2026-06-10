const express = require("express");
const Order = require("../schemas/order");
const { handleServerError, handleCastError, sendMessage } = require("./utils");

const ordersRouter = express.Router();

const validateOrder = (order) => {
  const { name, email, phone, address, products } = order;
  if (!name || typeof name !== "string" || name.length < 2)
    return "Invalid name";
  if (!email || typeof email !== "string") return "Invalid email";
  if (!phone || typeof phone !== "string") return "Invalid phone";
  if (!address || typeof address !== "string") return "Invalid address";
  if (!products || !Array.isArray(products) || !products.length)
    return "Invalid products array";
  for (const product of products) {
    const { count, product: id } = product;
    if (!count || typeof count !== "number" || count < 1)
      return `Invalid product count: ${count}`;
    const regex = /^[0-9a-fA-F]{24}$/;
    if (!id || typeof id !== "string" || !regex.test(id))
      return "Invalid product id";
  }
  return null;
};

ordersRouter.post("", async (req, res) => {
  const order = req.body;
  const errorMessage = validateOrder(order);
  if (errorMessage) 
    return sendMessage(res, errorMessage, 400); 
  try {
    const newOrder = new Order(order);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    handleServerError(error, res);
  }
});

ordersRouter.get("", async (req, res) => {
  const { email, phone } = req.query;
  if (!email || typeof email !== "string") 
    return sendMessage(res, "Wrong email format.", 400);
  if (!phone || typeof phone !== "string")
    return sendMessage(res, "Wrong phone format.", 400);
  try {
    const orders = await Order.find({ email, phone })
      .lean()
      .select({ products: 1, date: 1 })
      .sort({ date: -1 })
      .populate({
        path: "products.product",
        select: "name price picture",
      })
      .exec();
    res.json(orders);
  } catch (error) {
    handleServerError(res);
  }
});

ordersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .lean()
      .populate({
        path: "products.product",
        select: "name price picture",
      })
      .select({ date: 1, products: 1 })
      .exec();
    if (!order)
      return sendMessage(res, "Order with this ID does not exist.", 404);
    res.status(200).json(order);
  } catch (error) {
    if (handleCastError(error, res)) return;
    handleServerError(error, res);
  }
});

module.exports = ordersRouter;
