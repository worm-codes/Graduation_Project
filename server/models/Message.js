const mongoose=require('mongoose')
const MessageSchema=new mongoose.Schema({
    conversationId:{type:String},
    sender:{type:String},
    receiver:{type:String},
    text:{type:String},
    createdAt:{type :String}

})

module.exports=mongoose.model('Message',MessageSchema)