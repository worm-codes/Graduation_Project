const express=require('express'),
app=express(),
cors=require('cors'),
User=require('./models/User.js'),
mongoose=require("mongoose"),
mongoURI="mongodb://localhost/Local_Guide";




app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


app.post('/api/getUser',async (req,res)=>{   
     let foundedUser=await User.findOne({user_email:req.body.user_email})
         if(foundedUser){
        let timeSignIn=(req.body.user_last_sign_in.split(' GMT')[0])
        let timeCreation=(req.body.createdAt.split(' GMT')[0])
       
        if(!foundedUser.createdAt){
         await User.findByIdAndUpdate({_id:foundedUser._id},{createdAt:timeCreation})
        }
        
        await User.findByIdAndUpdate({_id:foundedUser._id},{lastSignIn:timeSignIn})
        console.log(foundedUser)
        res.json(foundedUser)
            }
            else{
                res.json('couldnt find')
            }

 })

app.post('/api/register',async (req,res)=>{
 
    let checkForId=await User.findOne({user_user_ID:req.body.user_ID})
    console.log(req.body)
    if(checkForId){
        return res.json('duplicate')
    }

        try{
        await User.create({
            user_ID:req.body.user_ID,
            user_name:req.body.user_name,
            user_surname:req.body.user_surname,
            user_gender:req.body.user_gender,
            user_email:req.body.user_email,
            user_date_of_birth:req.body.user_date_of_birth,
        })
       res.json('success')
    }
    catch(err){
        console.log(err)
        res.json('error')
    }
})


app.listen(5000,()=>{
    console.log('server has started')
})