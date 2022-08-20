require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const session=require('express-session');



const PORT=process.env.PORT;

app.use(express.static('uploads'))

//database connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true})
.then(()=>{
    console.log("Mongodb connected");
})
.catch((err)=>{
    console.log(err);
})

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized:true,
    resave:false

}))
app.use((req,res,next)=>{
    res.locals.message=req.session.message,
    delete req.session.message;
    next();
})


//set template engine
app.set('view engine','ejs');


//routes
app.use('/',require('./routes/routes'))






app.listen(PORT,(err)=>{
    console.log(`server running at ${PORT}`)
})