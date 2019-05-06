const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.usersSignupUser = (req,res, next) => {
    User.find({ email:req.body.email })
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(422).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                       });
                    user.save()
                    .then((result) => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Successfully Created'
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.usersLoginUser = (req, res, next) =>{
    User.find({ email: req.body.email})
    .exec()
    .then((user) => {
        // Checking if email exists
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            });
        } 
        // Checking if passwords match
        bcrypt.compare(req.body.password, user[0].password, (err,result) => {
            if(err){
                return res.status(401).json({
                    message: "Auth failed"
                });  
            }
            if(result){
                // Creating JWT
            const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, 
                        "secret",
                        {
                            expiresIn: "1h"
                        }
                        );
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            } 
            return res.status(401).json({
                message: "Auth failed"
            });
            
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.usersDeleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId}) 
    .exec()
    .then((result) => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}