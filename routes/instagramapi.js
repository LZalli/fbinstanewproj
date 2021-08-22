// Import Express module 
const express = require('express');
// Import Router
const router = express.Router();

const fs = require('fs');

const methodOverride = require('method-override');

var MongoClient = require('mongodb').MongoClient;


var jwt = require('jsonwebtoken');



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


  router.get('/instaid', function(req, res){
   
  

  
    MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
        // Client returned
       var db = client.db('mytestingdb');
       db.collection('Insta_page_id').find({}).toArray(function(err, pageid) {
          // Print the documents returned
          console.log(pageid)


                    res.json(pageid);
    
        /**  docs.forEach(function(doc) {
            console.log(doc.name);
          }); **/
          // Close the DB
          client.close();
    
          });
  
    
      }) 
    
     });


  router.get('/Instaviews', function(req, res){
   
  

  
      MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
          // Client returned
         var db = client.db('mytestingdb');
         db.collection('Insta_profile_views').find({}).toArray(function(err, pviews) {
            // Print the documents returned
            //console.log(pviews)
  
  
                      res.json(pviews);
      
          /**  docs.forEach(function(doc) {
              console.log(doc.name);
            }); **/
            // Close the DB
            client.close();
      
            });
    
      
        }) 
      
       });

  router.get('/Instareach', function(req, res){
   
  

  
        MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
            // Client returned
           var db = client.db('mytestingdb');
           db.collection('Insta_reach').find({}).toArray(function(err, reach) {
              // Print the documents returned
              //console.log(pviews)
    
    
                        res.json(reach);
        
            /**  docs.forEach(function(doc) {
                console.log(doc.name);
              }); **/
              // Close the DB
              client.close();
        
              });
      
        
          }) 
        
         });

  router.get('/Instaemail', function(req, res){
   
  

  
          MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
              // Client returned
             var db = client.db('mytestingdb');
             db.collection('Insta_email_contacts').find({}).toArray(function(err, emailinsta) {
                // Print the documents returned
                //console.log(pviews)
      
      
                          res.json(emailinsta);
          
              /**  docs.forEach(function(doc) {
                  console.log(doc.name);
                }); **/
                // Close the DB
                client.close();
          
                });
        
          
            }) 
          
           });

  router.get('/Instamsgclicks', function(req, res){
   
  

  
            MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
                // Client returned
               var db = client.db('mytestingdb');
               db.collection('Insta_text_message_clicks').find({}).toArray(function(err, messageclicks) {
                  // Print the documents returned
                  //console.log(pviews)
        
        
                            res.json(messageclicks);
            
                /**  docs.forEach(function(doc) {
                    console.log(doc.name);
                  }); **/
                  // Close the DB
                  client.close();
            
                  });
          
            
              }) 
            
             });

  router.get('/Instawebsite', function(req, res){
   
  

  
              MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
                  // Client returned
                 var db = client.db('mytestingdb');
                 db.collection('Insta_website_clicks').find({}).toArray(function(err, Instawebsite) {
                    // Print the documents returned
                    //console.log(pviews)
          
          
                              res.json(Instawebsite);
              
                  /**  docs.forEach(function(doc) {
                      console.log(doc.name);
                    }); **/
                    // Close the DB
                    client.close();
              
                    });
            
              
                }) 
              
               });

  router.get('/Instapageimpression', function(req, res){
   
  

  
                MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
                    // Client returned
                   var db = client.db('mytestingdb');
                   db.collection('Insta_page_impression').find({}).toArray(function(err, Instapageimpression) {
                      // Print the documents returned
                      //console.log(pviews)
            
            
                                res.json(Instapageimpression);
                
                    /**  docs.forEach(function(doc) {
                        console.log(doc.name);
                      }); **/
                      // Close the DB
                      client.close();
                
                      });
              
                
                  }) 
                
                 });

  router.get('/Instaaudcountry', function(req, res){
   
  

  
                  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
                      // Client returned
                     var db = client.db('mytestingdb');
                     db.collection('Insta_audience_country').find({}).toArray(function(err, Instaaudcountry) {
                        // Print the documents returned
                        //console.log(pviews)
              
              
                                  res.json(Instaaudcountry);
                  
                      /**  docs.forEach(function(doc) {
                          console.log(doc.name);
                        }); **/
                        // Close the DB
                        client.close();
                  
                        });
                
                  
                    }) 
                  
                   });
  router.get('/Instaaudcity', function(req, res){
   
  

  
                    MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
                        // Client returned
                       var db = client.db('mytestingdb');
                       db.collection('Insta_audience_city').find({}).toArray(function(err, Instaaudcity) {
                          // Print the documents returned
                          //console.log(pviews)
                
                
                                    res.json(Instaaudcity);
                    
                        /**  docs.forEach(function(doc) {
                            console.log(doc.name);
                          }); **/
                          // Close the DB
                          client.close();
                    
                          });
                  
                    
                      }) 
                    
                     });

  router.get('/Instaaudage', function(req, res){
   
  

  
    MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
        // Client returned
       var db = client.db('mytestingdb');
       db.collection('Insta_audience_gender_age').find({}).toArray(function(err, audience) {
          // Print the documents returned
          console.log(audience)


                    res.json(audience);
    
        /**  docs.forEach(function(doc) {
            console.log(doc.name);
          }); **/
          // Close the DB
          client.close();
    
          });
  
    
      }) 
    
     });

  router.get('/Instapostinfo', function(req, res){
   
  

  
      MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
          // Client returned
         var db = client.db('mytestingdb');
         db.collection('Insta_post_info').find({}).toArray(function(err, Instapostinfo) {
            // Print the documents returned
            //console.log(pviews)
  
  
                      res.json(Instapostinfo);
      
          /**  docs.forEach(function(doc) {
              console.log(doc.name);
            }); **/
            // Close the DB
            client.close();
      
            });
    
      
        }) 
      
       });  
  router.get('/Instapostmore', function(req, res){
   
  

  
        MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
            // Client returned
           var db = client.db('mytestingdb');
           db.collection('Insta_post_moredetails').find({}).toArray(function(err, Instapostmoredetails) {
              // Print the documents returned
              //console.log(pviews)
    
    
                        res.json(Instapostmoredetails);
        
            /**  docs.forEach(function(doc) {
                console.log(doc.name);
              }); **/
              // Close the DB
              client.close();
        
              });
      
        
          }) 
        
         });  
         
  router.get('/Instastory', function(req, res){
   
  

  
          MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
              // Client returned
             var db = client.db('mytestingdb');
             db.collection('Insta_stories').find({}).toArray(function(err, story) {
                // Print the documents returned
                //console.log(pviews)
      
      
                          res.json(story);
          
              /**  docs.forEach(function(doc) {
                  console.log(doc.name);
                }); **/
                // Close the DB
                client.close();
          
                });
        
          
            }) 
          
           });     
           
  router.get('/storydetails', function(req, res){
   
  

  
            MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
                // Client returned
               var db = client.db('mytestingdb');
               db.collection('Insta_stories_details').find({}).toArray(function(err, storydetails) {
                  // Print the documents returned
                  //console.log(pviews)
        
        
                            res.json(storydetails);
            
                /**  docs.forEach(function(doc) {
                    console.log(doc.name);
                  }); **/
                  // Close the DB
                  client.close();
            
                  });
          
            
              }) 
            
             }); 

  // router.get('/instamongo', function(req, res){
   
  

  
  //   MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
  //       // Client returned
  //      var db = client.db('mytestingdb');
  //      db.collection('Insta_audience_gender_age').find({}).toArray(function(err, pageImpression) {
  //         // Print the documents returned
  //         console.log(pageImpression)
  //         for (var i = 0; i < pageImpression.length; i++){
  //             console.log("<br><br>array index: " + i);
  //            var obj = pageImpression[i];
  //           console.log(obj.name) 
  //           var decoded = jwt.verify(obj.name,'secret');
  //           console.log(decoded)
  //         }

  //                   res.json(decoded);
    
  //       /**  docs.forEach(function(doc) {
  //           console.log(doc.name);
  //         }); **/
  //         // Close the DB
  //         client.close();
    
  //         });
  
    
  //     }) 
    
  //    });


  module.exports = router;
  