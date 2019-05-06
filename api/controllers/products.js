const mongoose = require('mongoose');

const Product = require('../models/product');

exports.productsGetAll = (req,res,next) => {
    Product.find()
    .select('name price productImage _id') 
    // OR you can use .select('-__v')
    .exec()
    .then((docs) => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                        //OR Dynamic URLs url:  req.protocol + '://' + req.get('host') +'/products/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
}

exports.productsCreateProduct = (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
         });
    })
    //Catching Error and using Promise instead of callbacks
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    }); 
   }

   exports.productsGetProduct = (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') +'/products/'
                }
            });                
            } else {
            res.status(404).json({
                message: "No valid entry found for the provided ID"
            });                
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        });  
}

exports.productsUpdateProduct = (req,res,next) => {
    const id = req.params.productId;
    const props = req.body;
    Product.updateOne({_id: id}, props)
    .exec()
    .then((result) => {
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url:  req.protocol + '://' + req.get('host') +'/products/' + id
            }
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: err
    })
});
}

exports.productDeleteProduct = (req,res,next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}