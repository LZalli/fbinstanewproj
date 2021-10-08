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


//token
  router.get('/adminToken', verifyToken, function(req,res,next){
    return res.status(200).json(decodedToken.token);
  })
  
  var decodedToken='';
  function verifyToken(req,res,next){
    let token = req.query.token;
  
    jwt.verify(token,'secret', function(err, tokendata){
      if(err){
        return res.status(400).json({message:' Unauthorized request'});
      }
      if(tokendata){
        decodedToken = tokendata;
        next();
      }
    })
  }

    //get routes starts here getall
router.get('/AllUtilisateur', (req, res) => {
    admins.find({})
        .then(utilisateur => {
            console.log(utilisateur);
            res.json(utilisateur);
          
        })
        .catch(err => {
            console.log('error_msg', 'ERROR: '+err);

        })

});
  
//get routes starts here
router.get('/GetAdmin/:id', (req, res) => {
  admins.findById({ _id: req.params.id })
      .then(administrateur => {
          console.log(administrateur);
          res.json(administrateur);
        
      })
      .catch(err => {
          console.log('error_msg', 'ERROR: '+err);

      })

});


router.delete("/deleteAdmin/:id", (req, res, next) => {
  admins.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});
//Login
//Login



//adminnew  

router.post("/Adminadd", (req, res, next) => {
  const admin = new admins({
            user: req.body.user,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.password,
    
  });
 
  
  

  admin.save().then(createdadmin => {
    res.status(201).json({
      message: "admin added successfully",
      postId: createdadmin._id
    });
 
  });
});


///end-of admin


// login etudiant
router.post('/LoginAdmin',(req, res) => {
  console.log(req.body.Email);
  admins.findOne({ Email: req.body.Email})
  .then(admins => {
    if(admins==null){
      return res.status(501).json({message:'User email is not registered.'})

    }else{
      verfpassword=bcrypt.compare(req.body.password, admins.password);
      if(verfpassword){ 
        let token = jwt.sign({token:admins},'secret', {expiresIn : '3h'});
      return res.status(200).json(token);
    }else{
      return res.status(401).json({
        message: 'Password invalid'
    })
    }
      

    // return res.json({token});
    }
     
  })
  .catch(err => {
      console.log('error_msg', 'ERROR: '+err);

  })
});


router.get('/alluser', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('admins').find({}).toArray(function(err, pagefansgenderage) {
        // Print the documents returned
        res.json(pagefansgenderage);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end-of login etudiant
module.exports = router;
