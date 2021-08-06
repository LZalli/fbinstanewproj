const express = require('express');
const app = express();
const mongoose = require('mongoose');
var cors = require('cors')
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const methodOverride = require('method-override');

app.use(cors())
app.use('*', cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//middleware for  method override
app.use(methodOverride('_method'));
dotenv.config({path: './configuration/.env'});
//database connection  Mongoose
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
});
const facebookRoutes = require('./routes/facebook');
const instagramRoutes = require('./routes/instagram');
const adminRoutes = require('./routes/admin');
app.use(facebookRoutes);
app.use(instagramRoutes);
app.use(adminRoutes);

app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});