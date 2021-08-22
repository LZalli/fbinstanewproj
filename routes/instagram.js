const express         =     require('express')
  , passport          =     require('passport')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('../configuration/config');
var jwt = require ('jsonwebtoken');



  const dotenv = require('dotenv');

var MongoClient = require('mongodb').MongoClient;





const router = express.Router();
  var path = require('path');
  var tokken = "" ;
  var sumrec = "" ;
  const fetch = require('node-fetch');
  const stringifyObject = require('stringify-object');
  var thenewfbtoken = "" ;
  
  router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
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
  router.use(bodyParser.urlencoded({extended : true}));
  router.use(bodyParser.json());
  router.get('/enter', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
  });





//Define MySQL parameter in Config.js file.


// Passport session setup.



router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({ secret: 'keyboard cat', key: 'sid'}));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.static(__dirname + '/public'));
router.use(bodyParser.json());


router.post('/instapageid' , (req,res) => {
  //console.log('testtest'+process.env['tokken']);
   instatok = process.env['tokken'];
  // console.log('tok2'+ instatok);
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var idarray = [] ;
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'?fields=instagram_business_account,name&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 
.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
idarray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_page_id").drop();
   //console.log(text)
    db.collection("Insta_page_id").insertMany(idarray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(idarray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
}); 
});

router.post('/instametric' , (req,res) => {
 // console.log(pageid);
 instatok = process.env['tokken'];

var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
 // Insta_profile_views
 var testarray = [] ;
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var instaid = req.body.pageid;
var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=profile_views&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 

.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
testarray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_profile_views").drop();
   //console.log(text)
    db.collection("Insta_profile_views").insertMany(testarray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(testarray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
//end Insta_profile_views

// Insta_reach
var reacharray = [] ;

var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=reach&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 

.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
reacharray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_reach").drop();
   //console.log(text)
    db.collection("Insta_reach").insertMany(reacharray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(reacharray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
//end Insta_reach

// Insta_email_contacts
var emailarray = [] ;

var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=email_contacts&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 

.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
emailarray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_email_contacts").drop();
   //console.log(text)
    db.collection("Insta_email_contacts").insertMany(emailarray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(emailarray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
//end Insta_email_contacts


// Insta_text_message_clicks
var messagearray = [] ;

var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=text_message_clicks&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 

.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
messagearray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_text_message_clicks").drop();
   //console.log(text)
    db.collection("Insta_text_message_clicks").insertMany(messagearray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(messagearray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
//end Insta_text_message_clicks


// Insta_website_clicks
var webarray = [] ;

var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=website_clicks&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 

.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
webarray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_website_clicks").drop();
   //console.log(text)
    db.collection("Insta_website_clicks").insertMany(webarray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(webarray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
//end Insta_website_clicks


// Insta_page_impression
var imparray = [] ;

var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=impressions&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.json())
// .then(text => res.json(text)) 

.then(json => {
  // console.log(text);
//var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
imparray.push(json);
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("Insta_page_impression").drop();
   //console.log(text)
    db.collection("Insta_page_impression").insertMany(imparray, function(err, res) {  
      console.log("connect"+ db)

      if (err) throw err;  
      console.log("1 record inserted");  
      });  
  }) 
res.json(imparray);

//res.render('table', { data: values});

})
.catch(err => {
  console.log(err);
});
//end Insta_page_impression
});
});

router.post('/instaaudience' , (req,res) => {
  // console.log(pageid);
  instatok = process.env['tokken'];
 
 var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
 .then(res => res.json())
 .then((json)=>{
 thenewfbtoken = json.access_token;
 
 //console.log('tokenp'+thenewfbtoken);
  // console.log('tokenp'+thenewfbtoken)
  // Insta_audience_country
  var countryarray = [] ;
   var instaid = req.body.instaid;
 var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_country&period=lifetime&access_token='+thenewfbtoken+'')
 
 .then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(text);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 countryarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_audience_country").drop();
    //console.log(text)
     db.collection("Insta_audience_country").insertMany(countryarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 //res.json(countryarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
 //end Insta_audience_country
 
 // Insta_audience_city
 var cityarray = [] ;
 
 var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_city&period=lifetime&access_token='+thenewfbtoken+'')
 
 .then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(text);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 cityarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_audience_city").drop();
    //console.log(text)
     db.collection("Insta_audience_city").insertMany(cityarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 //res.json(cityarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
 //end Insta_audience_city
 
 // Insta_audience_gender_age
 var agearray = [] ;
 
 var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_gender_age&period=lifetime&access_token='+thenewfbtoken+'')
 
 .then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(info => { 
   var newar = info.data;
var token = jwt.sign({ data:newar},'secret');
console.log(token);

   //console.log(info.data)
  //  for (var i = 0; i < newar.length; i++){
  //   console.log("<br><br>array index: " + i);
  //   var obj = newar[i];
  //   for (var key in obj){
  //     var value = obj[key];
  //     console.log("<br> - " + key + ": " + value);
  //     data = value.values;
  //     for (var key in data){
  //       var infovalue = data[key];
  //       console.log("<br> - " + key + ": " + infovalue);
  //     }

   // }
 // }
 /** info.map(obj => renameKey(obj, 'F.13-17','F1317')); **/
  //  const updateInfo = JSON.stringify(info); 
  //  console.log(updateInfo) 
   // console.log(text);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
   // console.log(text);
  // obj=JSON.parse(JSON.stringify(info));
    //var obj1 = JSON.stringify(body);
 //var values = obj.data ;
let infodata= {};
 infodata['name']=token;
 agearray.push(infodata);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_audience_gender_age").drop();
    //console.log(text)
     db.collection("Insta_audience_gender_age").insertMany(agearray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   })    
 res.json(newar);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
 //end Insta_audience_gender_age
 
 });
 });

 router.post('/instaaudienceV2' , (req,res) => {
  // console.log(pageid);
  instatok = process.env['tokken'];
 
 var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
 .then(res => res.json())
 .then((json)=>{
 thenewfbtoken = json.access_token;
 
 //console.log('tokenp'+thenewfbtoken);
  // console.log('tokenp'+thenewfbtoken)
  // Insta_audience_country
  var countryarray = [] ;
   var instaid = req.body.instaid;
 var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_country&period=lifetime&access_token='+thenewfbtoken+'')
 
 .then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(text);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 countryarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_audience_country").drop();
    //console.log(text)
     db.collection("Insta_audience_country").insertMany(countryarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 //res.json(countryarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
 //end Insta_audience_country
 
 // Insta_audience_city
 var cityarray = [] ;
 
 var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_city&period=lifetime&access_token='+thenewfbtoken+'')
 
 .then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(text);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 cityarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_audience_city").drop();
    //console.log(text)
     db.collection("Insta_audience_city").insertMany(cityarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 //res.json(cityarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
 //end Insta_audience_city
 
 // Insta_audience_gender_age
 var agearray = [] ;
 
 var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_gender_age&period=lifetime&access_token='+thenewfbtoken+'')
 
 .then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(info => { 
   var newar = info.data;

   //console.log(info.data.values);
   const obj2 = {};

    for (var key in newar){
      var value = newar[key];
      console.log("<br> - " + key + ": " + value);
    
      data = value['values'];
var item = data[0].value ; 
      // console.log(value['values'].value);
      // console.log(data['value']);
     console.log(data[0].value);

      for (var key in item){
        var infovalue = item[key];
        console.log("<br> - " + key + ": " + infovalue);
        obj2[key.replace(/[|&;$%@."<>(),]/g, "")] = item[key];

       }



    
  }




   
  agearray.push(obj2);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_audience_gender_age").drop();
    //console.log(text)
     db.collection("Insta_audience_gender_age").insertMany(agearray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   })    
 res.json(newar);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
 //end Insta_audience_gender_age
 
 });
 });


router.post('/instaposts' , (req,res) => {
 // console.log(pageid);
 instatok = process.env['tokken'];

var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var instaid = req.body.instaid;
  postyarray=[];
var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/media?fields=media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count&since='+startdate+'&until='+enddate+'&access_token='+thenewfbtoken+'')

.then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
    console.log(json);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 postyarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_post_info").drop();
    //console.log(text)
     db.collection("Insta_post_info").insertMany(postyarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 res.json(postyarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
});
});


router.post('/instapostdetails' , (req,res) => {
 // console.log(pageid);
 instatok = process.env['tokken'];
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;
detailsarray=[];
//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var postid = req.body.postid;
var htt =fetch('https://graph.facebook.com/'+postid+'/insights?metric=engagement,impressions,reach,saved&access_token='+thenewfbtoken+'')

.then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(json);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 detailsarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_post_moredetails").drop();
    //console.log(text)
     db.collection("Insta_post_moredetails").insertMany(detailsarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 res.json(detailsarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
});
});

router.post('/instastories' , (req,res) => {
 // console.log(pageid);
 instatok = process.env['tokken'];
 storyarray=[];
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var instaid = req.body.instaid;
var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/stories?fields=timestamp,permalink&access_token='+thenewfbtoken+'')

.then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(json);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 storyarray.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_stories").drop();
    //console.log(text)
     db.collection("Insta_stories").insertMany(storyarray, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 res.json(storyarray);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
});
});

//à voir 
router.post('/storydetails' , (req,res) => {
 // console.log(pageid);
 instatok = process.env['tokken'];

var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;
storydetails=[];
console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
  var storyid = req.body.storyid;
var htt =fetch('https://graph.facebook.com/v10.0/'+storyid+'/insights?metric=exits,impressions,reach,replies,taps_forward&access_token='+thenewfbtoken+'')

.then(res => res.json())
 // .then(text => res.json(text)) 
 
 .then(json => {
   // console.log(json);
 //var obj = JSON.parse(text);
 //var obj = JSON.stringify(text);
 //var values = obj.data ;
 storydetails.push(json);
 MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
     // Client returned
    var db = client.db('mytestingdb');
    //db.collection("Insta_stories_details").drop();
    //console.log(text)
     db.collection("Insta_stories_details").insertMany(storydetails, function(err, res) {  
       console.log("connect"+ db)
 
       if (err) throw err;  
       console.log("1 record inserted");  
       });  
   }) 
 res.json(storydetails);
 
 //res.render('table', { data: values});
 
 })
 .catch(err => {
   console.log(err);
 });
});
});
   




//endpost from facebookapi
function ensureAuthenticated(req, res, next) {
 // console.log('the new req' + req);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
module.exports = router;
