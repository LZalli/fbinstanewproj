const mongoose = require ("mongoose");
const adminSchema = mongoose.Schema({
    user:String,
    email:{type: String},
    tel : {type:Number},
    status:{ type: Boolean},
    password : String,
    confirmPassword : String,
  

});

module.exports = mongoose.model('admin',adminSchema);