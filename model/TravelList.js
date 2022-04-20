var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelListSchema = new Schema({
  
    marked_by:{
        type:String
    },
    title:{
        type:String
    },
 
    description:{
        type:String
    },

    travelDate:{
        type:String
    },
    
    lat:{
        type:Number
    },
    lng:{
        type:Number
    },
    status:{
        type:String,
        default:'FIXED'
    },

    buddies:[
        
            {
                name:{type:String},
                email:{type:String}
            }
        
    ]
})

var TravelList =  mongoose.model('TravelList',travelListSchema);

module.exports={TravelList}
