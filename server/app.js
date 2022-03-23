const express=require('express'),
app=express(),
cors=require('cors'),
passport=require('passport'),
User=require('./models/User.js'),
mongoose=require("mongoose"),
cookieSession=require('cookie-session'),
passportSetup=require('./passport'),
authRoute=require('./routes/auth')

dotenv=require('dotenv').config(),
mongoURI="mongodb://localhost/Local_Guide",
CryptoJS=require('crypto-js');



app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cookieSession({
  name: 'session',
  keys: ["oski"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.initialize());
app.use(passport.session())

app.use('/auth',authRoute)


/*
app.post('/api/register',async (req,res)=>{
    
    let user=await User.findOne({user_email:req.body.user_email,user_ID:req.body.user_ID})

    if(user){
        return res.json('duplicate')
    }
       const hashedPw=CryptoJS.AES.encrypt(req.body.user_password, 'secret key 123').toString();
      
        try{
        await User.create({
            user_ID:req.body.user_ID,
            user_name:req.body.user_name,
            user_surname:req.body.user_surname,
            user_email:req.body.user_email,
            user_date_of_birth:req.body.user_date_of_birth,
            user_password:hashedPw

        })
        
        res.json('success')
    }
    catch(err){
        console.log(err)
        res.json('error')

    }

    
    
    
})

app.post('/api/login',async (req,res)=>{
    res.redirect('/register')
    
 
    
})
app.post('/api/search',(req,res)=>{
    
  
})

app.post('/api/logout',(req,res)=>{
 if(currentSession.userid){
     req.session.destroy(),
     console.log('SESSION KILLED')
     res.json('killed')
 }
})*/

app.listen(5000,()=>{
    console.log('server has started')
})