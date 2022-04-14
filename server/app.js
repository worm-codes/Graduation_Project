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
        const { arriving, city, country, description, host, leaving, maxPeople, minTime, maxTime, state, userToProcess } = req.body;
        let theUser = await User.findOne({user_email:theEmail})
        theUserAge = new Date().getFullYear() - parseInt(theUser.user_date_of_birth.substring(0,4).toString());
        console.log("theEmail variable",theEmail)
        console.log("theUser variable",theUser)
    
    const theAd = await new Ad({ arriving_date: arriving, city, country, description, host, leaving_date:leaving, maxPeople, minTime,
         maxTime, state, owner_gender:theUser.user_gender, owner_email: theUser.user_email, owner_age: theUserAge.toString(), owner_id: theUser._id})

    theUser.populate('user_ads');


    theUser.user_ads.push(theAd);
    await theAd.save();
    await theUser.save();

        res.json('success')
        //res.redirect('/myads')
}
    catch(err){
    console.log(err)
    res.json('error')
}
})

app.get('/api/myads', MiddleWare.isAuth, async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    //console.log("user variable",user)
    // let usersAdsArr = []
    let userAdArr = []
    for(let ad of user.user_ads){
         let temp = await Ad.findById(ad._id)
         if(temp !== null){
            userAdArr.push(temp)
         }      
    }
    //console.log("usersAdsArr var",usersAdsArr)
    // console.log(userAdArr)
    // let arrToUse = userAdArr.splice(16, userAdArr.length - 16)
//     let lastValid = userAdArr.slice(-1)

//     for(let adv of user.user_ads){
//         let temp = await Ad.findById(adv._id)
//         if(temp !== null) {
//             lastValid.push(temp)
//             console.log("temp var:",temp)
            
//         }    
//    }
//     console.log("lasValid:", lastValid)
 
    res.send([userAdArr])
})

app.put('/api/myads', async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    console.log("user variable",user)
    // const { id } = req.params;
    // let usersAdsArr = []
    // for(let ad of user.user_ads){
    //      let temp = await Ad.findById(ad._id)
    //     usersAdsArr.push(temp)
    // }
    const { adID } = req.body;
    let theAdToChange = await Ad.findByIdAndUpdate({_id: adID}, { isActive : false});
    console.log("the clicked ads id:", adID)
    //console.log("usersAdsArr var",usersAdsArr)
 
    // res.send([usersAdsArr])
})

app.listen(5000,()=>{
    console.log('server has started')
})