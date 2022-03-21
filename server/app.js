const express=require('express');
app=express(),
cors=require('cors'),
User=require('./models/User.js')
mongoose=require("mongoose"),
session=require('express-session'),
MongoDBSession=require('connect-mongodb-session')(session),
dotenv=require('dotenv').config(),
mongoURI="mongodb://localhost/Local_Guide",
CryptoJS=require('crypto-js');


const storeSessionOptions=new MongoDBSession({
    uri:mongoURI,
    collection:'userSessions'
})
app.use(cors())
app.use(express.json())
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
    secret:'You know what to do',
    resave:false,//for to be create 1 element not duplicate
    saveUninitialized:false, //do not save if the session is not modified
    store:storeSessionOptions
}))



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
    
const user=await User.findOne({
    user_email:req.body.user_email
})

if(user){

   let Pw=await CryptoJS.AES.decrypt(user.user_password, 'secret key 123'); 
   let toCheck=await Pw.toString(CryptoJS.enc.Utf8);
  
   if(toCheck===req.body.user_password){
       req.session.user=user
       console.log(req.session.user)
       req.session.isAuth=true;
        console.log(req.session)
    
   return res.json('success')
   }
}
else{
    res.json('error')
}
       
   

      

   
    
})
app.post('/api/search',(req,res)=>{
    
   
})

app.listen(5000,()=>{
    console.log('server has started')
})