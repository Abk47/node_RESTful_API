const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);        
    }
});

// Filtering types of files to accept or reject
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Importing Controller
const ProductsController = require('../controllers/products');

router.get('/', ProductsController.productsGetAll);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.productsCreateProduct);

router.get('/:productId', ProductsController.productsGetProduct);

router.patch('/:productId', checkAuth, ProductsController.productsUpdateProduct);

router.delete('/:productId', checkAuth, ProductsController.productDeleteProduct);


module.exports = router;