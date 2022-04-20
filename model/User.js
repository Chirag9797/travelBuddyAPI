var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userschema = new Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
      type:Number  
    },
 
    gender:{
        type:String
    },
    
    address:{
        type:String
    },
    
    interest:{
        type:String
    }
})

var User =  mongoose.model('User',userschema);

module.exports={User}
