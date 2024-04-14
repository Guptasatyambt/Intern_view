const {setuser}=require('../service/auth')
const User=require('../models/usermodel');
const bycrpt=require('bcrypt');




async function handleregister(req,res){
    const{email,password} =req.body
    if(!email||!password){
        return res.status(400).json("All field are compulsory");
    }
    const allReadyExist=await User.findOne({email})
    if(allReadyExist){
        return res.status(400).json("User Exist")
    }
    const bycrptpassword=await bycrpt.hash(password,10)
    const user=await User.create({
        name:"",
        email:email,
        password:bycrptpassword,
        resume:"",
        profileimage:"",
        college:"",
        branch:"",
        year:"",
        specialization:"",
        interest:"",
    })
    const token=setuser(user);
    return res.status(200).json({token});  
    }
     
    async function handledetails(req,res){
        const {name,college,branch,year,specialization,interest,resume,profileimage}=req.body
        if(!name||!college||!branch||!year||!specialization||!interest&&req.file){
            return res.status(400).json("All field are compulsory");
        }
        const user=req.user;
    const email=user.email;
    const password=user.password;
   const updateduser= await User.findByIdAndUpdate(user._id,
        {$set:{
        name:name,
        email:email,
        password:password,
        resume:req.files['resume'][0].path,
        profileimage:req.files['profileimage'][0].path,
        college:college,
        branch:branch,
        year:year,
        specialization:specialization,
        interest:interest,
    }}
    ,{new:true})
    res.status(200).json(updateduser)
    }

    async function handlelogin(req,res){
        const {email,password}=req.body;
        if(!email ||!password){
            res.status(400)
            throw new Error("enter details correctly")
        }
    
        const user=await User.findOne({email})
        if(!user){
            res.status(404)
            throw new Error("User not exist! please sign In")
        }
        if(user&& (await bycrpt.compare(password,user.password))){
            const token=setuser(user)
            res.status(200).json({token})
        }
        else{
            res.status(400).json({message:"Incorrect password"})
        }
    }

    async function getinfo(req,res){
        
        try{
            const email=req.user.email;
            const user=await User.findOne({email})
            return res.status(200).json(user);
        }catch(e){
             res.status(401).json({message:"sorry"})
        }
    }

    async function handlestart(req,res){
        const email=req.user.email;
        const user=await User.findOne({email})
        const level=req.query.level
        let coin=user.coins;
        let fee=50
        if(level=='beginner'){
            fee=50
            
        }
        if(level=='intermidiate'){
            fee=75
        }
        if(level=='advance'){
            fee=100
        }
    
    if(coin>=fee){
        coin=coin-fee;
        const updateduser= await User.findByIdAndUpdate(user._id,
             {$set:{
             coins:coin,
         }}
         ,{new:true})
         res.status(200).json(updateduser)
        
    }
    else{
    res.status(201).json({message:"Insufficient Balance"})
    }
    }
    async function givecoins(req,res){
        const email=req.user.email;
        const user=await User.findOne({email})
        var coins=user.coins
        coins+=100
        const updateduser= await User.findByIdAndUpdate(user._id,
            {$set:{
            coins:coins,
        }}
        ,{new:true})
        res.status(200).json(updateduser)
    }
    module.exports={handleregister,handledetails ,handlelogin,getinfo,handlestart,givecoins};