const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

//Importing model - This get actives when you don't use the controllers
// const Order = require('../models/order');
// const Product = require('../models/product');

//Importing Controller
const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.ordersGetAll);

router.post('/', checkAuth, OrdersController.ordersCreateOrder);

router.get('/:orderId', checkAuth, OrdersController.ordersGetOrder);

router.delete('/:orderId', checkAuth, OrdersController.ordersDeleteOrder);

module.exports = router;