const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Importing Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//Importing Model
const Product = require('./api/models/product');

//Connecting to MongoDB Atlas
mongoose.connect('mongodb+srv://node-shop:node-shop@node-rest-shop-nzdjc.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true 
});
mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);

//Middleware
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS or we can import the CORS Library using NPM 
app.use( (req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
    return res.status(200).json({});    
}
next();
});

//Routes which handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use( (req,res,next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;