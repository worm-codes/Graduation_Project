var mongoose=require("mongoose");

var userSchema=new mongoose.Schema({
	user_ID:{type:String, required:true,unique:true},
    user_name:{type:String, required:true},
    user_surname:{type:String, required:true},
    user_email:{type:String, required:true,unique:true},
    user_date_of_birth:{type:String, required:true},
    user_password:{type:String, required:true},
    quote:{type:String},
    createdAt:{type:String, default:new Date().toLocaleString().replace(',','')}
	
},{collection:'user-data'});

module.exports=mongoose.model("UserData",userSchema);