const express = require("express");
const app = express();
const morgan = require("morgan");//loging package for nodejs, morgan behind the scene call the next function 
const mongoose = require("mongoose");

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://node-nick-shop:'+  +'@node-rest-shop.bjxg2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useMongoClient: true, //so that under the hood it will use mongodb client as it is the recommended way
});

// app.use((req,res,next) => {
//     res.status(200).json({
//         message:"its working voila"
//     })
// })
app.use(morgan('dev'));
app.use(express.urlencoded({ extended:false}));
app.use(express.json());

//to prevent cors errors
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*'); //value is * which means to every one allow access or its value coould have been http://mycoolpage.com only to this allow access
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept,Authorization')// this is for which type of headers we want to accept
    if(req.method === 'OPTIONS') { //browser will always sent and option req first when u send a post request or a put request
       res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
       return res.status(200).json({})
    }
    next();//if we dont add this will end up blocking our incoming req , so that other routes can take over
})

//routes which handle req
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

//error handling 
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);//  this next method will forward the error  
})

app.use((error,req,res,next) => {
    res.status(error.status || 500); 
    res.json({
        error:{
            message_1: error.message,
            message_2:"invalid url!!!"
        }
    })
})
module.exports = app;