const mongoose = require('mongoose');

// Model Import
const Order = require('../models/order');
const Product = require('../models/product');

exports.ordersGetAll = (req,res,next) => {
    Order.find()
    .select('-__v')
    .populate('product')
    .exec()
    .then((docs) => {
       console.log(docs);
       res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
             return {
                _id: doc._id,
                product: doc.product,
                quantity: doc.quantity,
                request: {
                    type: 'GET',
                    url:  req.protocol + '://' + req.get('host') +'/orders/' + doc._id
              }
             }
          })
        
       });
    })
    .catch((err) => {
       console.log(err);
       res.status(500).json({
        error: err
     });
    });
} 

exports.ordersCreateOrder = (req,res,next) => {
    Product.findById(req.body.productId)
       .then( (product) => {
          if(!product){
             res.status(404).json({
                message: 'Product not found'
             });
          }
          const order = new Order({
             _id: mongoose.Types.ObjectId(),
             product: req.body.productId,
             quantity: req.body.quantity
          });
          return order
          .save()
          .then((result) => {
             console.log(result)
             res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                   _id: result._id,
                   product: result.product,
                   quantity: result.quantity
                },
                request: {
                   type: 'POST',
                   url: req.protocol + '://' + req.get('host') +'/orders/' + result._id
                }
             });
          })
          .catch((err) => {
             console.log(err);
             res.status(500).json({
                error:err
             });
          });
       })
 
 }

 exports.ordersGetOrder =  (req,res,next) => {
    Order.findById(req.params.orderId)
    .select('-__v')
    .populate('product')
    .exec()
    .then(order => {
       if(!order) {
          return res.status(404).json({
             message: 'Order not found'
          });
       }
       res.status(200).json({
          order: order,
          request: {
             type: 'GET',
             url: req.protocol + '://' + req.get('host') +'/orders/'
          }
       })
    })
    .catch((err) => {
       res.status(500).json({
          error: err
       })
    });
}

exports.ordersDeleteOrder = (req,res,next) => {
    Order.remove({_id: req.params.orderId })
    .exec()
    .then((result) => {
       res.status(200).json({
          message: 'Order deleted',
          request: {
             type: 'POST',
             url: req.protocol + '://' + req.get('host') +'/orders/',
             body: {productId: "ID", quantity: "Number"}
          }
       });
    })
    .catch((err) => {
       res.status(500).json({
          error: err
       })
    });
 }