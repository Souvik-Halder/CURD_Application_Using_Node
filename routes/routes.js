const express=require('express');
const router=express.Router();
const User=require('../models/users');
const multer=require('multer');
const users = require('../models/users');
const fs=require('fs');
//To upload the image multer is required


//upload image
var storage=multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads')//we need to create the directory
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({
    storage:storage
}).single('image')


//Insert an user into data base 

router.post('/add',upload,(req,res)=>{
    const {name,email,phone}=req.body;
    console.log(req.body);
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
});


//Edit an user route
router.get('/edit/:id',(req,res)=>{
    let id=req.params.id;
    User.findById(id,(err,user)=>{
        if(err){
            res.redirect('/');
        }
        else{
            if(user == null){
                res.redirect('/');
            }
            else{
                res.render('edit_users',{
                    title:"Edit User",
                    user:user
                })
            }
        }
    })
})


//update user route
router.post('/update/:id',upload,(req,res)=>{
    let id=req.params.id;
    let new_image="";
    if(req.file){
        new_image=req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
           
        }catch(err){
            console.log(req.body.old_image)
            console.log(err);
        }
    }else{
        new_image=req.body.old_image;
    }
    User.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:new_image
    },(err,result)=>{
        if(err){
            res.json({message:err.message ,type:danger})
        }
        else{
            req.session.message={
                type:'success',
                message:'Updated user successfully'
            };
            res.redirect('/');
        }
    })
})

//delete the user
router.get('/delete/:id',(req,res)=>{
  let id=req.params.id;
  User.findByIdAndRemove(id,(err,result)=>{
    if(result.image != ''){
    try{
        fs.unlinkSync('./uploads/'+result.image);
    }catch(err){
        console.log(err);
    }
}
if(err){
    res.json({
    message:err.message
    })
}
else{
    req.session.message={
        type:'info',
        message:'User deleted successfully'
    };
    res.redirect('/');
}
  })
})
module.exports=router;