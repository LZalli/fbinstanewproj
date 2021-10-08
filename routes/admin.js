// Import Express module 
const express = require('express');
// Import Router
const router = express.Router();
// Import User Module
const admins = require('../models/admin')
// cryptage password
const bcrypt = require('bcrypt');
// JWT plugin
const jwt = require('jsonwebtoken');
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');


router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS,PUT"
  );
  next();
});
router.use(methodOverride('_method'));



//adduser
router.post('/adduser', function(req,res) {
   admins.find({ user: req.body.user })
   .exec()
   .then(user => {
     if (user.length >= 1) {
       return res.status(409).json({
         message: "username exists"
       });
     } else {
       bcrypt.hash(req.body.password, 10, (err, hash) => {
         if (err) {
           return res.status(500).json({
             error: err
           });
         } else {
           const admin = new admins({
             user: req.body.user,
             password: hash
           });
           admin
             .save()
             .then(result => {
               console.log(result);
               res.status(201).json({
                 message: "User created"
               });
             })
             .catch(err => {
               console.log(err);
               res.status(500).json({
                 error: err
               });
             });
         }
       });
     }
   });
  });

//login
  router.post('/loginuser', function(req,res) {
    admins.find({ user: req.body.user })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              user: user[0].user,
              userId: user[0]._id
            },
            "secret",
            {
              expiresIn: "4h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            user: user[0].user,
              _Id: user[0]._id
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
   });



//end-of login etudiant
module.exports = router;
