// contactModel.js
var mongoose = require('mongoose');


//schema
const userSchema = mongoose.Schema({
        username: String,
        password: String,
    },
    {
        timestamps:true
      });
      
// User model extraction
module.exports = mongoose.model('User',userSchema);