const config = require('config');
const mongoose = require('mongoose');


mongoose.Promise=global.Promise;
try {
    
    mongoose.connect("mongodb+srv://jishan:hetvi27@cluster0-tnq7r.mongodb.net/test?retryWrites=true&w=majority");
} catch (error) {
    console.log(error)
}

module.exports={
    mongoose
};
