const express=require('express');
const router=express.Router();
const User=require('../models/users');
const multer=require('multer');
const users = require('../models/users');
//To upload the image multer is required


//upload image
var storage=multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads')//we need to create the directory
    },
    filename:function(req,file,cb){
        cb(null,file.filename+"_"+Date.now()+"_"+file.originalname)
    }
})

var upload = multer({
    storage:storage
}).single('image')


//Insert an user into data base 

router.post('/add',upload,(req,res)=>{
    const {name,email,phone}=req.body;
     const user =new User({
          name,
          email,
          phone,
          image:req.file.filename
     });
     user.save((err)=>{
        if(err){
            res.json({message:err.message ,type:'danger'})
        }
        else{
            req.session.message={
                type:'success',
                message:'user added successfully'
            };
            res.redirect('/');
        }
     })
})

//Get all the users 
router.get('/',(req,res)=>{
  User.find((err,users)=>{
    function json2array(json){
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key){
            result.push(json[key]);
        });
        return result;
    }
    const result=json2array(users)

    if(err){
        res.json({message:err.message})
    }else{
        res.render('index',{
            title:'Home page',
            users:result,
        })
    }
  })
})

router.get('/add',(req,res)=>{
    res.render('add_user',{title:"Add users"})
})

module.exports=router;