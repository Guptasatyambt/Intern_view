const InterView = require('../models/interview');
const User = require('../models/usermodel');

async function handlestart(req, res) {
    try {
    const email = req.user.email;
   const user = await User.findOne({ email });
   const level=req.query.level
        if (!user) {
            return res.status(404).json({message:"User not Found"});
        }
        let coin=user.coins;
        let fee=50
        
        if(level=='beginner'){
            fee=10  
        }
        if(level=='intermidiate'){
            fee=15
        }
        if(level=='advance'){
            fee=25
        }
    
    if(coin>=fee){
        coin=coin-fee;
        const updateduser= await User.findByIdAndUpdate(user._id,
             {$set:{
             coins:coin,
         }}
         ,{new:true})
        //  res.status(200).json(updateduser)
        
    }
    else{
    res.status(201).json({message:"Insufficient Balance"})
    }
        const _id = user.id;
        const interview = await InterView.create({
            auther: _id, // Assuming _id is the ObjectId of the user
            email: email,
            level: level // Assuming userFeedback is the feedback content
        });

        return res.status(200).json({message:"Start Successfully"});
    } catch (error) {
        return res.status(500).json({message:error});
    }
}


async function handlestop(req, res) {

    const {result,confidence,accuracy,eye,neck}=req.body
    const id=req.params.id
    if(!result||!confidence||!accuracy||!eye||!neck){
        return res.status(400).json("All field are compulsory");
    }
    const updateinterview= await InterView.findByIdAndUpdate(id,
        {$set:{
       result:result,
       confidence:confidence,
       accuracy:accuracy,
       eye:eye,
       neck:neck,
       status:true
    }}
    ,{new:true})
    res.status(200).json(updateinterview)
}

async function getinfo(req, res) {      
    try{
        const user=req.user;
        const interview=await InterView.find({auther:user._id})
        return res.status(200).json(interview);
    }catch(e){
         res.status(401).json({message:"sorry"})
    }
}
async function getinfoone(req, res) {
    try{
        const id=req.params.interviewid
        const interview=await InterView.findById(id)
        return res.status(200).json(interview);
    }catch(e){
         res.status(401).json({message:"sorry"})
    }
}

async function givecoin(req, res) {
    try{
        const level=req.query.level
        const result=req.query.result
        const email=req.user.email;
        const user=await User.findOne({email})
        
        var coins=user.coins
        var reward=0
        if(level=='beginner'){
           reward=10+result
        }
        if(level=='intermidiate'){
            reward=15+result*2
        }
        if(level=='advance'){
            reward=25+result*5
        }
        coins+=reward
            const updateduser= await User.findByIdAndUpdate(user.id,
                {$set:{
                coins:coins,
            }}
            ,{new:true})
            return res.status(200).json({updateduser})
        
    
        
        
    }catch(e){
        res.status(401).json({message:e})
   }
}

module.exports = {handlestart,handlestop, getinfo,givecoin ,getinfoone};
