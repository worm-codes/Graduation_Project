const MiddleWare = require('./middleware/CheckAuth');

const express=require('express'),
app=express(),
cors=require('cors'),
User=require('./models/User.js'),
mongoose=require("mongoose"),
mongoURI="mongodb://localhost/Local_Guide",
helmet=require('helmet')



 




app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
app.use(helmet())
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });



app.post('/api/getUser',MiddleWare.isAuth,async (req,res)=>{   
     let foundedUser=null
     if(MiddleWare.decodeValue &&req.body.user_email){
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
       
        

 })

app.post('/api/register',async (req,res)=>{
    let checkForId=await User.findOne({user_ID:req.body.user_ID})

    if(checkForId){
        return res.json('duplicate')
    }
         console.log('yaratmadan once')
        try{
            console.log('yaratiyor')
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

app.get('/api/getAllUsers',MiddleWare.isAuth,async(req,res)=>{
    await User.find({},(err,Users)=>{
        if(err){
            throw err
            
        }
        else{
            res.json(Users)
        }
    }).clone().catch(function(err){ console.log(err)})

})

app.get('/api/:id',MiddleWare.isAuth,async(req,res)=>{
     let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
      console.log(user.contacts[1]._id.toString()) //sadece id yi elde ediyoruz
      let user2=await User.findOne({_id:user.contacts[1]._id.toString()})
      console.log(user2)
      
      if(MiddleWare.decodeValue){
          await User.findOne({user_email:MiddleWare.decodeValue.email},async (err,currentUser)=>{
           if(err){
               console.log(err);
           }
           if (req.params.id && !currentUser.contacts.includes(req.params.id)){
                await User.findOne({_id:req.params.id},(err,userToConnect)=>{
                if(err){
                console.log(err)
                 }
                if(!userToConnect._id.equals(currentUser._id)){
                res.json(userToConnect)
                currentUser.contacts.push(userToConnect)
                currentUser.save()

                userToConnect.contacts.push(currentUser)
                userToConnect.save()

                }


                }).clone().catch(function(err){ console.log(err)})
                
              }

              
           }).clone().catch(function(err){ console.log(err)})

      }
      
        

})


app.listen(5000,()=>{
    console.log('server has started')
})