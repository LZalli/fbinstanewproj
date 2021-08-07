const express         =     require('express')
  , passport          =     require('passport')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('../configuration/config');







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
var htt =fetch('https://graph.facebook.com/v10.0/'+pageid+'?fields=instagram_business_account,name&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
   console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
//console.log(values)

res.json(obj);
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
var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var instaid = req.body.pageid;
var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=impressions,profile_views,reach,email_contacts,text_message_clicks,website_clicks&since='+startdate+'&until='+enddate+'&period=day&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
res.json(obj);
//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});
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

  var   instaid= req.body.instaid;
var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/insights?metric=audience_country,audience_city,audience_gender_age&period=lifetime&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
//var values = obj.data ;
res.json(obj);
//res.render('table', { data: values});

})

.catch(err => {
  console.log(err);
});
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

var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/media?fields=media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count&since='+startdate+'&until='+enddate+'&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
res.json(obj);
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

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var postid = req.body.postid;
var htt =fetch('https://graph.facebook.com/'+postid+'/insights?metric=engagement,impressions,reach,saved&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
res.json(obj);
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

var htt =fetch('https://graph.facebook.com/'+pageid+'?fields=access_token&access_token=' + instatok)
.then(res => res.json())
.then((json)=>{
thenewfbtoken = json.access_token;

//console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var instaid = req.body.instaid;
var htt =fetch('https://graph.facebook.com/v10.0/'+instaid+'/stories?fields=timestamp,permalink&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
res.json(obj);
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

console.log('tokenp'+thenewfbtoken);
 // console.log('tokenp'+thenewfbtoken)
var startdate = req.body.startdate;
  var storyid = req.body.storyid;
var htt =fetch('https://graph.facebook.com/v10.0/'+storyid+'/insights?metric=exits,impressions,reach,replies,taps_forward&access_token='+thenewfbtoken+'')

.then(res => res.text())
// .then(text => res.json(text)) 
.then(text => {
  // console.log(text);
var obj = JSON.parse(text);
//var obj = JSON.stringify(text);
var values = obj.data ;
res.json(obj);
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
