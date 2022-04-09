const MiddleWare = require('./middleware/CheckAuth');

const express=require('express'),
app=express(),
cors=require('cors'),
User=require('./models/User.js'),
Ad = require('./models/Ads'),
mongoose=require("mongoose"),
mongoURI="mongodb://localhost:27017/Local_Guide";

// mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true });

 




app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
mongoose.connect('mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true });



app.post('/api/getUser',MiddleWare.isAuth,async (req,res)=>{   
     let foundedUser=null
   
     if(MiddleWare.decodeValue){
       foundedUser=await User.findOne({user_email:MiddleWare.decodeValue.email})
     
         if(foundedUser){
        let timeSignIn=(req.body.user_last_sign_in?.split(' GMT')[0])
        let timeCreation=(req.body.createdAt?.split(' GMT')[0])
       
        if(!foundedUser.createdAt){
         await User.findByIdAndUpdate({_id:foundedUser._id},{createdAt:timeCreation})
        }
         
        await User.findByIdAndUpdate({_id:foundedUser._id},{lastSignIn:timeSignIn})
      
        res.json(foundedUser)
            }
            else{
                res.json('couldnt find')
            }
        }
        else{
            res.json('UnAuth')
        }

 })

app.post('/api/register',async (req,res)=>{
    console.log('helllooooooo')
    let checkForId=await User.findOne({user_ID:req.body.user_ID})
    console.log(checkForId)
    console.log(req)
    if(checkForId){
        return res.json('duplicate')
    }
         console.log('yaratmadan once')
        try{
            console.log('yaratiyor')
        let theNewUser = await User.create({
            user_ID:req.body.user_ID,
            user_name:req.body.user_name,
            user_surname:req.body.user_surname,
            user_gender:req.body.user_gender,
            user_email:req.body.user_email,
            user_date_of_birth:req.body.user_date_of_birth,
        })
       res.json('success')
       console.log(theNewUser)
    }
    catch(err){
        console.log(err)
        res.json('error')
    }
})

app.post('/api/publish', async(req,res) =>{
    try{
        console.log('inside the try block')
        let theEmail = req.body.userToProcess.email;
        const { arriving, city, country, description, host, leaving, maxPeople, minTime, maxTime, state, userToProcess} = req.body;
        let theUser = await User.findOne({user_email:theEmail})
        //theUserAge = new Date().getFullYear() - theUser.user_date_of_birth.substring(0,4).toString();
        console.log("theEmail variable",theEmail)
        console.log("theUser variable",theUser)

    //     let theAd = await Ad.create({
    //     arriving_date:req.body.arriving,
    //     city:req.body.city,
    //     country:req.body.country,
    //     owner_gender:theUser.user_gender, //buraya req.body.user_gender veya direkt user_gender gelicek
    //     owner_email:theUser.user_email,
    //     owner_age:'18', 
    //     owner_id:theUser._id,
    //     description: req.body.description,
    //     host: req.body.host,
    //     leaving_date: req.body.leaving,
    //     maxPeople: req.body.maxPeople,
    //     minTime: req.body.minTime,
    //     maxTime: req.body.maxTime,
    //     state: req.body.state

    // })
    
    const theAd = await new Ad({ arriving_date: arriving, city, country, description, host, leaving_date:leaving, maxPeople, minTime,
         maxTime, state, owner_gender:theUser.user_gender, owner_email: theUser.user_email, owner_age: '18', owner_id: theUser._id})

    theUser.user_ads.push(theAd);
    await theAd.save();
    await theUser.save();

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