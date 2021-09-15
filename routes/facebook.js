const express         =     require('express')
  , passport          =     require('passport')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('../configuration/config')
  , mysql             =     require('mysql');
  const dotenv = require('dotenv');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data';
dotenv.config({path: '../configuration/.env'});

const router = express.Router();
  var path = require('path');
  var tokken = "" ;
  var sumrec = "" ;
  const fetch = require('node-fetch');
  const stringifyObject = require('stringify-object');
  var thenewfbtoken = "" ;
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodelogin'
  });
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

  router.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
      connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect('/');
        } else {
          response.send('Incorrect Username and/or Password!');
        }			
        response.end();
      });
    } else {
      response.send('Please enter Username and Password!');
      response.end();
    }
  });


  router.get('/home', function(request, response) {
    if (request.session.loggedin) {
      response.send('Welcome back, ' + request.session.username + '!');
      
    } else {
      response.send('Please login to view this page!');
    }
  response.end();

  });

//Define MySQL parameter in Config.js file.
const pool = mysql.createPool({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url,
    profileFields: ["id", "birthday", "email", "first_name", "last_name", "gender", "picture.width(200).height(200)"],


  },
  function accestoken(accessToken, refreshToken, profile, done) {
    //console.log('user token : ' + accessToken);
     tokken = accessToken;
     process.env['tokken']=tokken;
    process.nextTick(function  () {
      //Check whether the User exists or not using profile.id
      if(config.use_database) {
        // if sets to true
        pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
          if(err) throw err;
          if(rows && rows.length === 0) {
              console.log("There is no such user, adding now");
              pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
          } else {
              console.log("User already exists in database");
          }
          
        });
      } 
     // console.log('le profil est ' + profile);

     return done(null, profile);
    });
  
  }

));


router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({ secret: 'keyboard cat', key: 'sid'}));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.static(__dirname + '/public'));
router.use(bodyParser.json());


router.get('/', function(req, res){
  res.render('index', { user: req.user });
  
  

});



router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));


router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }); 

  router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




router.post('/Pagepostsfb' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/posts?fields=permalink_url,id,created_time,shares,likes.limit(0).summary(true),comments.limit(0).summary(true)&since='+startdate+'&until='+enddate+'&limit=100&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
//console.log(obj)
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   //db.collection("postfacebook").drop();
   //console.log(values)
   if (db.collection("postfacebook").indexExists()) {
    db.collection("postfacebook").drop();
    db.collection("postfacebook").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("postfacebook").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 
res.json(obj.data);

//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});


var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/posts?fields=insights.metric(post_engaged_users,post_negative_feedback,post_engaged_fan,post_clicks,post_impressions,post_impressions_paid,post_impressions_fan,post_impressions_fan_paid,post_impressions_organic,post_impressions_viral,post_impressions_nonviral),permalink_url&since='+startdate+'&until='+enddate+'&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
   //console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   //db.collection("postdetails").drop();
   console.log(values)
   if (db.collection("postdetails").indexExists()) {
    db.collection("postdetails").drop();
    db.collection("postdetails").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("postdetails").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 
res.json(obj.data);
      res.redirect('/viewadmin');

})

.catch(err => {
  console.log(err);
});

});
});


router.post('/facebook' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //Page_Impressions
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("pageImpression").drop();
   console.log(values)
if (db.collection("pageImpression").indexExists()) {
  db.collection("pageImpression").drop();
  db.collection("pageImpression").insertMany(values, function(err, res) {  
    console.log("connect"+ db)

  //  if (err) throw err;  
    console.log("1 record inserted");  
    });  

}
else {
  db.collection("pageImpression").insertMany(values, function(err, res) {  
    console.log("connect"+ db)

  //  if (err) throw err;  
    console.log("1 record inserted");  
    });}

  }) 




})

.catch(err => {
  console.log(err);
});

//end Page_Impressions

//page_views_total 
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_views_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
 //  db.collection("pageViewsTotal").drop();
   console.log(values)
   if (db.collection("pageViewsTotal").indexExists()) {
    db.collection("pageViewsTotal").drop();
    db.collection("pageViewsTotal").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("pageViewsTotal").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_views_total

//page_actions_post_reactions_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_actions_post_reactions_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_total").indexExists()) {
    db.collection("page_actions_post_reactions_total").drop();
    db.collection("page_actions_post_reactions_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_actions_post_reactions_total

//page_total_actions
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_total_actions&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_total_actions").drop();
   console.log(values)
   if (db.collection("page_total_actions").indexExists()) {
    db.collection("page_total_actions").drop();
    db.collection("page_total_actions").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_total_actions").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
 
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_total_actions

//page_engaged_users
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_engaged_users&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_engaged_users").drop();
   console.log(values)
   if (db.collection("page_engaged_users").indexExists()) {
    db.collection("page_engaged_users").drop();
    db.collection("page_engaged_users").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_engaged_users").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_engaged_users

//page_post_engagements
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_post_engagements&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_post_engagements").drop();
   console.log("valuuuuuuuuuuuuues",values)
   if (db.collection("page_post_engagements").indexExists()) {
    db.collection("page_post_engagements").drop();
    db.collection("page_post_engagements").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_post_engagements").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_post_engagements
});
});
//admin page view 
router.get('/viewadmin', function(req, res){
  var mynewlist= [] ;
//console.log('the token', tokken);
  var gh =fetch('https://graph.facebook.com/me?fields=accounts&access_token='+ tokken)
  .then(res => res.json())
 .then((json)=>{
   //console.log(json.accounts);
  for (i = 0; i < json.accounts.data.length; i++) {
  pagename = json.accounts.data[i].name;
  pageid = json.accounts.data[i].id;
   mynewlist.push({ pagename , pageid })

}


  res.render('admin', { mylist:mynewlist});

 });

});

  router.get('/viewFB' , (req,res) => {
    res.render('facebook');
    })
  //end-of admin 

  
router.post('/pagefans' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //page_fans
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fans&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_fans").drop();
   console.log(values)
   if (db.collection("page_fans").indexExists()) {
    db.collection("page_fans").drop();
    db.collection("page_fans").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fans").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});

//end page_fans

//page_fans_locale 
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fans_locale&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
 //  db.collection("page_fans_locale").drop();
   console.log(values)
   if (db.collection("page_fans_locale").indexExists()) {
    db.collection("page_fans_locale").drop();
    db.collection("page_fans_locale").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fans_locale").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_fans_locale

//page_fans_city
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fans_city&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_fans_city").drop();
   console.log(values)
   if (db.collection("page_fans_city").indexExists()) {
    db.collection("page_fans_city").drop();
    db.collection("page_fans_city").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fans_city").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_fans_city

//page_fans_country
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fans_country&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_fans_country").drop();
   console.log(values)
   if (db.collection("page_fans_country").indexExists()) {
    db.collection("page_fans_country").drop();
    db.collection("page_fans_country").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fans_country").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 

 // res.render('table', { data: values});
 


})

.catch(err => {
  console.log(err);
});
//end page_fans_country

//page_fans_gender_age
agearray =[];
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fans_gender_age&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  //console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var newar = obj.data ;
//console.log(newar)
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
  //console.log(obj2)
  agearray.push(obj2);

MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
   db.collection("page_fans_gender_age").drop();
  //  console.log(values)
  if (db.collection("page_fans_gender_age").indexExists()) {
    db.collection("page_fans_gender_age").drop();
    db.collection("page_fans_gender_age").insertMany(agearray, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fans_gender_age").insertMany(agearray, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 

  res.json(obj2);


})

.catch(err => {
  console.log(err);
});
//end page_fans_gender_age


//page_fan_adds
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fan_adds&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_fan_adds").drop();
   console.log(values)
   if (db.collection("page_fan_adds").indexExists()) {
    db.collection("page_fan_adds").drop();
    db.collection("page_fan_adds").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fan_adds").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_fan_adds


//page_fans_by_like_source
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fans_by_like_source&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_fans_by_like_source").drop();
   console.log(values)
   if (db.collection("page_fans_by_like_source").indexExists()) {
    db.collection("page_fans_by_like_source").drop();
    db.collection("page_fans_by_like_source").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fans_by_like_source").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_fans_by_like_source

//page_fan_removes
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_fan_removes&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_fan_removes").drop();
   console.log(values)
   if (db.collection("page_fan_removes").indexExists()) {
    db.collection("page_fan_removes").drop();
    db.collection("page_fan_removes").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_fan_removes").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_fan_removes
});
});


router.post('/pageimpression' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //page_impressions_paid
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_paid&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_impressions_paid").drop();
   console.log(values)
   if (db.collection("page_impressions_paid").indexExists()) {
    db.collection("page_impressions_paid").drop();
    db.collection("page_impressions_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_impressions_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});

//end page_impressions_paid

//page_impressions_organic 
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_organic&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
 //  db.collection("page_impressions_organic").drop();
   console.log(values)
   if (db.collection("page_impressions_organic").indexExists()) {
    db.collection("page_impressions_organic").drop();
    db.collection("page_impressions_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_impressions_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_impressions_organic

//page_impressions_viral
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_viral&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_impressions_viral").drop();
   console.log(values)
   if (db.collection("page_impressions_viral").indexExists()) {
    db.collection("page_impressions_viral").drop();
    db.collection("page_impressions_viral").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_impressions_viral").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_impressions_viral

//page_impressions_nonviral
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_nonviral&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_impressions_nonviral").drop();
   console.log(values)
   if (db.collection("page_impressions_nonviral").indexExists()) {
    db.collection("page_impressions_nonviral").drop();
    db.collection("page_impressions_nonviral").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_impressions_nonviral").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_impressions_nonviral

// //page_impressions_by_story_type
// var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_by_story_type&since='+startdate+'&until='+enddate+'&period=day')

// .then(res => res.text())
// // .then(text => res.json(text)) 
// .then(text => {
//   // console.log(text);
// var obj = JSON.parse(text);
// //var obj = JSON.stringify(text);
// var values = obj.data ;
// MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//     // Client returned
//    var db = client.db('mytestingdb');
//   // db.collection("page_impressions_by_story_type").drop();
//    console.log(values)
//     db.collection("page_impressions_by_story_type").insertMany(values, function(err, res) {  
//       console.log("connect"+ db)

//     //  if (err) throw err;  
//       console.log("1 record inserted");  
//       });  
//   }) 

//   res.render('table', { data: values});


// })

// .catch(err => {
//   console.log(err);
// });
// //end page_impressions_by_story_type


// //page_impressions_frequency_distribution
// var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_frequency_distribution&since='+startdate+'&until='+enddate+'&period=day')

// .then(res => res.text())
// // .then(text => res.json(text)) 
// .then(text => {
//   // console.log(text);
// var obj = JSON.parse(text);
// //var obj = JSON.stringify(text);
// var values = obj.data ;
// MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//     // Client returned
//    var db = client.db('mytestingdb');
//   // db.collection("page_impressions_frequency_distribution").drop();
//    console.log(values)
//     db.collection("page_impressions_frequency_distribution").insertMany(values, function(err, res) {  
//       console.log("connect"+ db)

//     //  if (err) throw err;  
//       console.log("1 record inserted");  
//       });  
//   }) 

//   res.render('table', { data: values});


// })

// .catch(err => {
//   console.log(err);
// });
// //end page_impressions_frequency_distribution


// //page_impressions_viral_frequency_distribution
// var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions_viral_frequency_distribution&since='+startdate+'&until='+enddate+'&period=day')

// .then(res => res.text())
// // .then(text => res.json(text)) 
// .then(text => {
//   // console.log(text);
// var obj = JSON.parse(text);
// //var obj = JSON.stringify(text);
// var values = obj.data ;
// MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//     // Client returned
//    var db = client.db('mytestingdb');
//   // db.collection("page_impressions_viral_frequency_distribution").drop();
//    console.log(values)
//     db.collection("page_impressions_viral_frequency_distribution").insertMany(values, function(err, res) {  
//       console.log("connect"+ db)

//     //  if (err) throw err;  
//       console.log("1 record inserted");  
//       });  
//   }) 

//   res.render('table', { data: values});


// })

// .catch(err => {
//   console.log(err);
// });
// //end page_impressions_viral_frequency_distribution


});
});

router.post('/pagereactions' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //page_actions_post_reactions_like_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_like_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_actions_post_reactions_like_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_like_total").indexExists()) {
    db.collection("page_actions_post_reactions_like_total").drop();
    db.collection("page_actions_post_reactions_like_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_like_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});

//end page_actions_post_reactions_like_total

//page_actions_post_reactions_love_total 
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_love_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
 //  db.collection("page_actions_post_reactions_love_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_love_total").indexExists()) {
    db.collection("page_actions_post_reactions_love_total").drop();
    db.collection("page_actions_post_reactions_love_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_love_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_actions_post_reactions_love_total

//page_actions_post_reactions_wow_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_wow_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_actions_post_reactions_wow_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_wow_total").indexExists()) {
    db.collection("page_actions_post_reactions_wow_total").drop();
    db.collection("page_actions_post_reactions_wow_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_wow_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_actions_post_reactions_wow_total

//page_actions_post_reactions_haha_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_haha_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_actions_post_reactions_haha_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_haha_total").indexExists()) {
    db.collection("page_actions_post_reactions_haha_total").drop();
    db.collection("page_actions_post_reactions_haha_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_haha_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}    
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_actions_post_reactions_haha_total

//page_actions_post_reactions_sorry_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_sorry_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_actions_post_reactions_sorry_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_sorry_total").indexExists()) {
    db.collection("page_actions_post_reactions_sorry_total").drop();
    db.collection("page_actions_post_reactions_sorry_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_sorry_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_actions_post_reactions_sorry_total


//page_actions_post_reactions_anger_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_actions_post_reactions_anger_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_actions_post_reactions_anger_total").drop();
   console.log(values)
   if (db.collection("page_actions_post_reactions_anger_total").indexExists()) {
    db.collection("page_actions_post_reactions_anger_total").drop();
    db.collection("page_actions_post_reactions_anger_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_actions_post_reactions_anger_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_actions_post_reactions_anger_total



});
});


router.post('/pageviews' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //page_views_by_profile_tab_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_views_by_profile_tab_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_views_by_profile_tab_total").drop();
   console.log(values)
   if (db.collection("page_views_by_profile_tab_total").indexExists()) {
    db.collection("page_views_by_profile_tab_total").drop();
    db.collection("page_views_by_profile_tab_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_views_by_profile_tab_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});

//end page_views_by_profile_tab_total

// //page_views_external_referrals 
// var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_views_external_referrals&since='+startdate+'&until='+enddate+'&period=day')

// .then(res => res.text())
// // .then(text => res.json(text)) 
// .then(text => {
//   // console.log(text);
// var obj = JSON.parse(text);
// //var obj = JSON.stringify(text);
// var values = obj.data ;
// MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//     // Client returned
//    var db = client.db('mytestingdb');
//  //  db.collection("page_views_external_referrals").drop();
//    console.log(values)
//     db.collection("page_views_external_referrals").insertMany(values, function(err, res) {  
//       console.log("connect"+ db)

//     //  if (err) throw err;  
//       console.log("1 record inserted");  
//       });  
//   }) 




// })

// .catch(err => {
//   console.log(err);
// });
// //end page_views_external_referrals

//page_views_logged_in_total
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_views_logged_in_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_views_logged_in_total").drop();
   console.log(values)
   if (db.collection("page_views_logged_in_total").indexExists()) {
    db.collection("page_views_logged_in_total").drop();
    db.collection("page_views_logged_in_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_views_logged_in_total").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_views_logged_in_total

//page_views_logout
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_views_logout&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_views_logout").drop();
   console.log(values)
   if (db.collection("page_views_logout").indexExists()) {
    db.collection("page_views_logout").drop();
    db.collection("page_views_logout").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_views_logout").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_views_logout


});
});

router.post('/pagefdbconsu' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //page_positive_feedback_by_type
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_positive_feedback_by_type&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_positive_feedback_by_type").drop();
   console.log(values)
   if (db.collection("page_positive_feedback_by_type").indexExists()) {
    db.collection("page_positive_feedback_by_type").drop();
    db.collection("page_positive_feedback_by_type").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_positive_feedback_by_type").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 



//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});

//end page_positive_feedback_by_type

//page_negative_feedback 
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_negative_feedback&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
 //  db.collection("page_negative_feedback").drop();
   console.log(values)
   if (db.collection("page_negative_feedback").indexExists()) {
    db.collection("page_negative_feedback").drop();
    db.collection("page_negative_feedback").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_negative_feedback").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_negative_feedback

// //page_negative_feedback_by_type
// var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_negative_feedback_by_type&since='+startdate+'&until='+enddate+'&period=day')

// .then(res => res.text())
// // .then(text => res.json(text)) 
// .then(text => {
//   // console.log(text);
// var obj = JSON.parse(text);
// //var obj = JSON.stringify(text);
// var values = obj.data ;
// MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
//     // Client returned
//    var db = client.db('mytestingdb');
//   // db.collection("page_negative_feedback_by_type").drop();
//    console.log(values)
//     db.collection("page_negative_feedback_by_type").insertMany(values, function(err, res) {  
//       console.log("connect"+ db)

//     //  if (err) throw err;  
//       console.log("1 record inserted");  
//       });  
//   }) 




// })

// .catch(err => {
//   console.log(err);
// });
// //end page_negative_feedback_by_type

//page_consumptions
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_consumptions&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_consumptions").drop();
   console.log(values)
   if (db.collection("page_consumptions").indexExists()) {
    db.collection("page_consumptions").drop();
    db.collection("page_consumptions").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_consumptions").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_consumptions

//page_consumptions_by_consumption_type
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_consumptions_by_consumption_type&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_consumptions_by_consumption_type").drop();
   console.log(values)
   if (db.collection("page_consumptions_by_consumption_type").indexExists()) {
    db.collection("page_consumptions_by_consumption_type").drop();
    db.collection("page_consumptions_by_consumption_type").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_consumptions_by_consumption_type").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_consumptions_by_consumption_type

});
});


router.post('/pagevideos' , (req,res) => {
  var pageid = req.body.pageid;
 // console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  //page_video_views
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_views").drop();
   console.log(values)
   if (db.collection("page_video_views").indexExists()) {
    db.collection("page_video_views").drop();
    db.collection("page_video_views").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 



//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});

//end page_video_views

//page_video_views_paid 
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views_paid&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
 //  db.collection("page_video_views_paid").drop();
   console.log(values)
   if (db.collection("page_video_views_paid").indexExists()) {
    db.collection("page_video_views_paid").drop();
    db.collection("page_video_views_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_video_views_paid

//page_video_views_organic
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views_organic&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_views_organic").drop();
   console.log(values)
   if (db.collection("page_video_views_organic").indexExists()) {
    db.collection("page_video_views_organic").drop();
    db.collection("page_video_views_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 




})

.catch(err => {
  console.log(err);
});
//end page_video_views_organic

//page_video_views_click_to_play
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views_click_to_play&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_views_click_to_play").drop();
   console.log(values)
   if (db.collection("page_video_views_click_to_play").indexExists()) {
    db.collection("page_video_views_click_to_play").drop();
    db.collection("page_video_views_click_to_play").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views_click_to_play").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });} 
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_views_click_to_play

//page_video_repeat_views
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_repeat_views&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_repeat_views").drop();
   console.log(values)
   if (db.collection("page_video_repeat_views").indexExists()) {
    db.collection("page_video_repeat_views").drop();
    db.collection("page_video_repeat_views").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_repeat_views").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_repeat_views


//page_video_complete_views_30s
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_complete_views_30s&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_complete_views_30s").drop();
   console.log(values)
   if (db.collection("page_video_complete_views_30s").indexExists()) {
    db.collection("page_video_complete_views_30s").drop();
    db.collection("page_video_complete_views_30s").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_complete_views_30s").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_complete_views_30s


//page_video_complete_views_30s_paid
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_complete_views_30s_paid&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_complete_views_30s_paid").drop();
   console.log(values)
   if (db.collection("page_video_complete_views_30s_paid").indexExists()) {
    db.collection("page_video_complete_views_30s_paid").drop();
    db.collection("page_video_complete_views_30s_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_complete_views_30s_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_complete_views_30s_paid


//page_video_complete_views_30s_organic
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_complete_views_30s_organic&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_complete_views_30s_organic").drop();
   console.log(values)
   if (db.collection("page_video_complete_views_30s_organic").indexExists()) {
    db.collection("page_video_complete_views_30s_organic").drop();
    db.collection("page_video_complete_views_30s_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_complete_views_30s_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}  
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_complete_views_30s_organic


//page_video_views_10s
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views_10s&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_views_10s").drop();
   console.log(values)
   if (db.collection("page_video_views_10s").indexExists()) {
    db.collection("page_video_views_10s").drop();
    db.collection("page_video_views_10s").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views_10s").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_views_10s

//page_video_views_10s_paid
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views_10s_paid&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_views_10s_paid").drop();
   console.log(values)
   if (db.collection("page_video_views_10s_paid").indexExists()) {
    db.collection("page_video_views_10s_paid").drop();
    db.collection("page_video_views_10s_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views_10s_paid").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}    
  }) 



})

.catch(err => {
  console.log(err);
});
//end page_video_views_10s_paid


//page_video_views_10s_organic
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_video_views_10s_organic&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("page_video_views_10s_organic").drop();
   console.log(values)
   if (db.collection("page_video_views_10s_organic").indexExists()) {
    db.collection("page_video_views_10s_organic").drop();
    db.collection("page_video_views_10s_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("page_video_views_10s_organic").insertMany(values, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}   
  }) 

  res.redirect('/viewadmin');


})

.catch(err => {
  console.log(err);
});
//end page_video_views_10s_organic
});
});




router.get('/admins', function(req, res){
  var mynewlist= [] ;
//console.log('the token', tokken);
  var gh =fetch('https://graph.facebook.com/me?fields=accounts&access_token='+ tokken)
  .then(res => res.json())
 .then((json)=>{
   //console.log(json.accounts);
  for (i = 0; i < json.accounts.data.length; i++) {
  pagename = json.accounts.data[i].name;
  pageid = json.accounts.data[i].id;
   mynewlist.push({ pagename , pageid })

}


  res.render('form', { mylist:mynewlist});

 });

});
//les page  id des page facebook 
router.get('/pagead', function(req, res){
  var mynewlist= [] ;
//console.log('the token', tokken);
  var gh =fetch('https://graph.facebook.com/me?fields=accounts&access_token='+ tokken)
  .then(res => res.json())
 .then((json)=>{
   //console.log(json.accounts);
  for (i = 0; i < json.accounts.data.length; i++) {
  pagename = json.accounts.data[i].name;
  pageid = json.accounts.data[i].id;
   mynewlist.push({ pagename , pageid })

}

MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
   var db = client.db('mytestingdb');
  // db.collection("pagefacebook").drop();
   if (db.collection("pagefacebook").indexExists()) {
    db.collection("pagefacebook").drop();
    db.collection("pagefacebook").insertMany(mynewlist, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });  
  
  }
  else {
    db.collection("pagefacebook").insertMany(mynewlist, function(err, res) {  
      console.log("connect"+ db)
  
    //  if (err) throw err;  
      console.log("1 record inserted");  
      });}
  }) 
  res.json(mynewlist);

 });

});

//l'id des pages 
router.get('/pageid', function(req, res){
 // json=[{"nom":"laith", "prenom":"harzam"}];
 
  var mynewlist= [] ;
//console.log('the token', tokken);
  var gh =fetch('https://graph.facebook.com/me?fields=accounts&access_token='+ tokken)
  .then(res => res.json())
 .then((json)=>{
   //console.log(json.accounts);
  for (i = 0; i < json.accounts.data.length; i++) {
  pagename = json.accounts.data[i].name;
  pageid = json.accounts.data[i].id;
   mynewlist.push({ pagename , pageid })

}
res.json(mynewlist);

  
 });

});
router.get('/user', function(req,res,next){
/**MongoClient.connect(url, function(err, db) {  
  if (err) throw err;  
  var myobj = { name: "Ajeet Kumar", age: "28", address: "Delhi" };  
  db.collection("employees").insertOne(myobj, function(err, res) {  
  if (err) throw err;  
  console.log("1 record inserted");  
  db.close();  
  });  
  });  **/
  MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
  // Client returned
  var db = client.db('mytestingdb');
  var myobj = { name: "Ajeet Kumar", age: "28", address: "Delhi" };  

  db.collection("employees").insertOne(myobj, function(err, res) {  
    if (err) throw err;  
    console.log("1 record inserted");  
    client.close();  
    });  
});
})


//end api facebook DB
router.get('/apifb', function(req,res,next){
  
    MongoClient.connect('mongodb+srv://Laith:Azer1234@cluster0.9pyqc.mongodb.net/Data', (err, client) => {
    // Client returned
    var db = client.db('mytestingdb');
  
    db.collection('facebook').find({}).toArray(function(err, docs) {
      // Print the documents returned
      res.json(docs);

      docs.forEach(function(doc) {
        console.log(doc.name);
      });
      // Close the DB
      client.close();

      });
  });

  })
//end-of api facebook DB
//post formFacebook api 

//endpost from facebookapi
function ensureAuthenticated(req, res, next) {
 // console.log('the new req' + req);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
module.exports = router;
