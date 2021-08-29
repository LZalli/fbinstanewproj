// Import Express module 
const express = require('express');
// Import Router
const router = express.Router();

const fs = require('fs');

const methodOverride = require('method-override');

var MongoClient = require('mongodb').MongoClient;


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


//récupérer //les page  id des page facebook 

  router.get('/idp', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('pagefacebook').find({}).toArray(function(err, pagefacebook) {
        // Print the documents returned
        res.json(pagefacebook);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end of récupérer //les page  id des page facebook 


//récupérer //les posts des page facebook 

router.get('/postfacebook', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('postfacebook').find({}).toArray(function(err, postfacebook) {
        // Print the documents returned
        res.json(postfacebook);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end of récupérer les posts des page facebook

//récupérer les details des  posts  page facebook

router.get('/postfbdetails', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('postdetails').find({}).toArray(function(err, postdetails) {
        // Print the documents returned
        res.json(postdetails);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end of récupérer les details des  posts  page facebook



//récuperer les page impression de la page
router.get('/pageimp', function(req, res){
   
  

  
    MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
        // Client returned
       var db = client.db('mytestingdb');
       db.collection('pageImpression').find({}).toArray(function(err, pageImpression) {
          // Print the documents returned
          res.json(pageImpression);
    
        /**  docs.forEach(function(doc) {
            console.log(doc.name);
          }); **/
          // Close the DB
          client.close();
    
          });
  
    
      }) 
    
     });
//end


//récuperer les views total  de la page
router.get('/pageViewsTotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('pageViewsTotal').find({}).toArray(function(err, pageViewsTotal) {
        // Print the documents returned
        res.json(pageViewsTotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les reactions total  de la page
router.get('/reactionstotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_total').find({}).toArray(function(err, reactionstotal) {
        // Print the documents returned
        res.json(reactionstotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  totals actions  de la page
router.get('/totalactions', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_total_actions').find({}).toArray(function(err, totalactions) {
        // Print the documents returned
        res.json(totalactions);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  totals engaged users  de la page
router.get('/engagedusers', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_engaged_users').find({}).toArray(function(err, engagedusers) {
        // Print the documents returned
        res.json(engagedusers);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  totals postes ngagements users  de la page
router.get('/postengagements', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_post_engagements').find({}).toArray(function(err, postengagements) {
        // Print the documents returned
        res.json(postengagements);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  totals pagefans  de la page
router.get('/pagefans', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fans').find({}).toArray(function(err, pagefans) {
        // Print the documents returned
        res.json(pagefans);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  totals fans locale  de la page
router.get('/fanslocale', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fans_locale').find({}).toArray(function(err, fanslocale) {
        // Print the documents returned
        res.json(fanslocale);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  fans city  de la page
router.get('/fanscity', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fans_city').find({}).toArray(function(err, fanscity) {
        // Print the documents returned
        res.json(fanscity);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end






//récuperer les  fans country de la page
router.get('/fanscountry', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fans_country').find({}).toArray(function(err, fanscountry) {
        // Print the documents returned
        res.json(fanscountry);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  page fans gender&age de la page
router.get('/pagefansgenderage', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fans_gender_age').find({}).toArray(function(err, pagefansgenderage) {
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
//end



//récuperer les  page fanadds de la page
router.get('/pagefanadds', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fan_adds').find({}).toArray(function(err, pagefanadds) {
        // Print the documents returned
        res.json(pagefanadds);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  page fans by like source de la page
router.get('/pagefanslikesource', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fans_by_like_source').find({}).toArray(function(err, pagefanslikesource) {
        // Print the documents returned
        res.json(pagefanslikesource);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  page fan removes
router.get('/pagefanremoves', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_fan_removes').find({}).toArray(function(err, pagefanremoves) {
        // Print the documents returned
        res.json(pagefanremoves);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end




//récuperer les  page impressions paid
router.get('/pageimpaid', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_impressions_paid').find({}).toArray(function(err, pageimpressionspaid) {
        // Print the documents returned
        res.json(pageimpressionspaid);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page impressions organic
router.get('/pageimorganic', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_impressions_organic').find({}).toArray(function(err, pageimorganic) {
        // Print the documents returned
        res.json(pageimorganic);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  page impressions viral
router.get('/pageimviral', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_impressions_viral').find({}).toArray(function(err, pageimpviral) {
        // Print the documents returned
        res.json(pageimpviral);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  page impressions non viral
router.get('/pageimnonviral', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_impressions_nonviral').find({}).toArray(function(err, pageimpnonviral) {
        // Print the documents returned
        res.json(pageimpnonviral);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


// //récuperer les  page impressions story type
// router.get('/pageimptype', function(req, res){
   
  

  
//   MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//       // Client returned
//      var db = client.db('mytestingdb');
//      db.collection('page_impressions_by_story_type').find({}).toArray(function(err, pageimptype) {
//         // Print the documents returned
//         res.json(pageimptype);
  
//       /**  docs.forEach(function(doc) {
//           console.log(doc.name);
//         }); **/
//         // Close the DB
//         client.close();
  
//         });

  
//     }) 
  
//    });
// //end



// //récuperer les  page_impressions_frequency_distribution
// router.get('/pageimpfreq', function(req, res){
   
  

  
//   MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//       // Client returned
//      var db = client.db('mytestingdb');
//      db.collection('page_impressions_frequency_distribution').find({}).toArray(function(err, pageimpfreq) {
//         // Print the documents returned
//         res.json(pageimpfreq);
  
//       /**  docs.forEach(function(doc) {
//           console.log(doc.name);
//         }); **/
//         // Close the DB
//         client.close();
  
//         });

  
//     }) 
  
//    });
// //end



// //récuperer les  page_impressions_Viral frequency_distribution
// router.get('/pageimpvirfreq', function(req, res){
   
  

  
//   MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//       // Client returned
//      var db = client.db('mytestingdb');
//      db.collection('page_impressions_viral_frequency_distribution').find({}).toArray(function(err, pageimpvirfreq) {
//         // Print the documents returned
//         res.json(pageimpvirfreq);
  
//       /**  docs.forEach(function(doc) {
//           console.log(doc.name);
//         }); **/
//         // Close the DB
//         client.close();
  
//         });

  
//     }) 
  
//    });
// //end



//récuperer les  liketotal
router.get('/liketotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_like_total').find({}).toArray(function(err, liketotal) {
        // Print the documents returned
        res.json(liketotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  lovetotal
router.get('/lovetotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_love_total').find({}).toArray(function(err, lovetotal) {
        // Print the documents returned
        res.json(lovetotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  wowtotal
router.get('/wowtotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_wow_total').find({}).toArray(function(err, wowtotal) {
        // Print the documents returned
        res.json(wowtotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  hahatotal
router.get('/hahatotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_haha_total').find({}).toArray(function(err, hahatotal) {
        // Print the documents returned
        res.json(hahatotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  sorrytotal
router.get('/sorrytotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_sorry_total').find({}).toArray(function(err, sorrytotal) {
        // Print the documents returned
        res.json(sorrytotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  ang
router.get('/angtotal', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_actions_post_reactions_anger_total').find({}).toArray(function(err, angtotal) {
        // Print the documents returned
        res.json(angtotal);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_views_by_profile_tab_total
router.get('/pageviewsproftab', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_views_by_profile_tab_total').find({}).toArray(function(err, ptab) {
        // Print the documents returned
        res.json(ptab);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

// //récuperer les  page_views_external_referrals
// router.get('/pageviewsexternal', function(req, res){
   
  

  
//   MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//       // Client returned
//      var db = client.db('mytestingdb');
//      db.collection('page_views_external_referrals').find({}).toArray(function(err, pvextref) {
//         // Print the documents returned
//         res.json(pvextref);
  
//       /**  docs.forEach(function(doc) {
//           console.log(doc.name);
//         }); **/
//         // Close the DB
//         client.close();
  
//         });

  
//     }) 
  
//    });
// //end



//récuperer les  page_views_logged_in_total
router.get('/pageviewloggedin', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_views_logged_in_total').find({}).toArray(function(err, logintot) {
        // Print the documents returned
        res.json(logintot);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_views_logout
router.get('/pageviewslogout', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_views_logout').find({}).toArray(function(err, logouttot) {
        // Print the documents returned
        res.json(logouttot);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_positive_feedback_by_type
router.get('/positfdbtype', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_positive_feedback_by_type').find({}).toArray(function(err, postiv) {
        // Print the documents returned
        res.json(postiv);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  page_negative_feedback
router.get('/negativefdb', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_negative_feedback').find({}).toArray(function(err, negativ) {
        // Print the documents returned
        res.json(negativ);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


// //récuperer les  page_negative_feedback_by_type
// router.get('/negativefdbtype', function(req, res){
   
  

  
//   MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//       // Client returned
//      var db = client.db('mytestingdb');
//      db.collection('page_negative_feedback_by_type').find({}).toArray(function(err, negativtype) {
//         // Print the documents returned
//         res.json(negativtype);
  
//       /**  docs.forEach(function(doc) {
//           console.log(doc.name);
//         }); **/
//         // Close the DB
//         client.close();
  
//         });

  
//     }) 
  
//    });
// //end

//récuperer les  consumptions
router.get('/consumptions', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_consumptions').find({}).toArray(function(err, consumptions) {
        // Print the documents returned
        res.json(consumptions);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  consumptions by consumptions type
router.get('/consumptionstyp', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_consumptions_by_consumption_type').find({}).toArray(function(err, consumptionstyp) {
        // Print the documents returned
        res.json(consumptionstyp);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  videoviews
router.get('/videoviews', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views').find({}).toArray(function(err, videoviews) {
        // Print the documents returned
        res.json(videoviews);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_video_views_paid
router.get('/videoviewspaid', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views_paid').find({}).toArray(function(err, videoviewsp) {
        // Print the documents returned
        res.json(videoviewsp);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_video_views_organic
router.get('/videoviewsorganic', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views_organic').find({}).toArray(function(err, videoviewso) {
        // Print the documents returned
        res.json(videoviewso);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_video_views_click_to_play
router.get('/videoclk', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views_click_to_play').find({}).toArray(function(err, videoviewspl) {
        // Print the documents returned
        res.json(videoviewspl);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_video_repeat_views
router.get('/repeatviews', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_repeat_views').find({}).toArray(function(err, videoviewsrp) {
        // Print the documents returned
        res.json(videoviewsrp);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les  page_video_complete_views_30s
router.get('/completeviews30s', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_complete_views_30s').find({}).toArray(function(err, videoviewss) {
        // Print the documents returned
        res.json(videoviewss);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end

//récuperer les videos 30s paid
router.get('/paid30s', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_complete_views_30s_paid').find({}).toArray(function(err, videoviewss) {
        // Print the documents returned
        res.json(videoviewss);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  30s organic 
router.get('/organic30s', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_complete_views_30s_organic').find({}).toArray(function(err, videoviewss) {
        // Print the documents returned
        res.json(videoviewss);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end


//récuperer les  page_video_views_10s 
router.get('/videoviews10s', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views_10s').find({}).toArray(function(err, videoviewss) {
        // Print the documents returned
        res.json(videoviewss);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  10s paid 
router.get('/paid10s', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views_10s_paid').find({}).toArray(function(err, videoviewss) {
        // Print the documents returned
        res.json(videoviewss);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end



//récuperer les  10s organic 
router.get('/organic10s', function(req, res){
   
  

  
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
      // Client returned
     var db = client.db('mytestingdb');
     db.collection('page_video_views_10s_organic').find({}).toArray(function(err, videoviewss) {
        // Print the documents returned
        res.json(videoviewss);
  
      /**  docs.forEach(function(doc) {
          console.log(doc.name);
        }); **/
        // Close the DB
        client.close();
  
        });

  
    }) 
  
   });
//end




  module.exports = router;
  