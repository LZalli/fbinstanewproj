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
res.json(obj.data);
//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});
});
});

router.post('/postmoredetails' , (req,res) => {
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
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/posts?fields=insights.metric(post_engaged_users,post_negative_feedback,post_engaged_fan,post_clicks,post_impressions,post_impressions_paid,post_impressions_fan,post_impressions_fan_paid,post_impressions_organic,post_impressions_viral,post_impressions_nonviral,post_reactions_by_type_total),permalink_url&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
   //console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
res.json(obj.data);
//res.render('table', { data: values});

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
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions,page_views_total,page_impressions_unique,page_total_actions,page_engaged_users,page_fans,page_fan_adds_unique,page_fans,page_actions_post_reactions_like_total,page_actions_post_reactions_love_total,	page_actions_post_reactions_wow_total,	page_actions_post_reactions_haha_total,	page_actions_post_reactions_sorry_total,page_actions_post_reactions_anger_total,page_content_activity_by_age_gender_unique,page_content_activity_by_city_unique,page_content_activity_by_country_unique,page_content_activity_by_locale_unique,page_views_by_referers_logged_in_unique,page_views_by_site_logged_in_unique,page_views_by_internal_referer_logged_in_unique,page_views_by_profile_tab_logged_in_unique,page_views_by_profile_tab_total,page_views_external_referrals,page_views_logged_in_unique,page_views_logged_in_total,page_views_logout,page_views_total,page_video_views,page_video_views_paid,page_video_views_organic,page_video_views_autoplayed,page_video_views_click_to_play,page_video_views_unique,page_video_repeat_views,page_video_complete_views_30s,page_video_complete_views_30s_paid,page_video_complete_views_30s_organic,page_video_complete_views_30s_autoplayed,page_video_complete_views_30s_click_to_play,page_video_complete_views_30s_unique,page_video_complete_views_30s_repeat_views,post_video_complete_views_30s_autoplayed,post_video_complete_views_30s_clicked_to_play,post_video_complete_views_30s_organic,post_video_complete_views_30s_paid,post_video_complete_views_30s_unique,page_video_views_10s	,page_video_views_10s_paid,page_video_views_10s_organic,page_video_views_10s_autoplayed,page_video_views_10s_click_to_play,page_video_views_10s_unique,page_video_views_10s_repeat,page_video_view_time,page_fans,page_fans_locale,page_fans_city,page_fans_country,page_fans_gender_age,page_fan_adds,page_fans_by_like_source,page_fan_removes,page_fans_by_unlike_source_unique,page_actions_post_reactions_total,page_impressions,page_impressions_paid,page_impressions_organic,page_impressions_viral,page_impressions_nonviral,page_impressions_by_story_type,page_impressions_by_city_unique,page_impressions_by_country_unique,page_impressions_by_locale_unique,page_impressions_by_age_gender_unique,page_impressions_frequency_distribution,page_impressions_viral_frequency_distribution,page_engaged_users,page_post_engagements,page_consumptions,page_consumptions_by_consumption_type,page_negative_feedback,page_negative_feedback_by_type,page_positive_feedback_by_type,page_fans_online,page_fans_online_per_day,page_fan_adds_by_paid_non_paid_unique,page_total_actions,page_call_phone_clicks_logged_in_unique,page_get_directions_clicks_logged_in_unique,page_website_clicks_logged_in_unique&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
res.json(obj.data);
//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});
});
});



router.get('/admins', function(req, res){
  var mynewlist= [] ;
//console.log('the token', tokken);
  var gh =fetch('https://graph.facebook.com/me?fields=accounts&access_token='+ tokken)
  .then(res => res.json())
 .then((json)=>{
  for (i = 0; i < json.accounts.data.length; i++) {
  pagename = json.accounts.data[i].name;
  pageid = json.accounts.data[i].id;
   mynewlist.push({ pagename , pageid })
}

  res.render('form', { mylist:mynewlist});

 });

});
//l'id des pages 
router.get('/pageid', function(req, res){
  var mynewlist= [] ;
  var gh =fetch('https://graph.facebook.com/me?fields=accounts&access_token='+ tokken)
  .then(res => res.json())
 .then((resultat)=>{
 res.json(resultat)
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
router.post('/formfb' , (req,res) => {
  console.log("ffffffffffffffffffffffff");
  var pageid = req.body.pageid;
  console.log(pageid);
var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + tokken)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'/insights?access_token='+thenewfbtoken+'&pretty=0&metric=page_impressions,page_views_total,page_impressions_unique,page_total_actions,page_engaged_users,page_fans,page_fan_adds_unique,page_fans,page_actions_post_reactions_like_total,page_actions_post_reactions_love_total,	page_actions_post_reactions_wow_total,	page_actions_post_reactions_haha_total,	page_actions_post_reactions_sorry_total,page_actions_post_reactions_anger_total&since='+startdate+'&until='+enddate+'&period=day')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
console.log(obj);
var values = obj.data ;
res.json(obj.data);
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
