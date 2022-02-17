const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    price:{type:String,required:true},
});

module.exports = mongoose.model('Product',productSchema);
//model function takes 2 args first is the name
//of the model u want to use internally then the 2 arg is schema u want to use for that model