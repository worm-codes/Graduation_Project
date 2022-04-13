var mongoose=require("mongoose");

var adSchema=new mongoose.Schema({
	arriving_date:{type:String, required:true},
    city:{type:String, required:true},
    country:{type:String, required:true},
    owner_gender:{type:String}, 
    owner_email:{type:String},
    owner_age:{type:String},  
    owner_id: {type:String},
    description: {type:String, required:true},
    host: {type:String, required:true},
    leaving_date: {type:String, required:true},
    maxPeople: {type:String, required:true},
    maxTime: {type: String, required:true},
    minTime: {type:String, required:true},
    state: {type:String, required: true},
    isActive: {type:Boolean, default:true}
    // quote:{type:String},
    // lastSignIn:{type:String},
    // createdAt:{type:String},
    
	
},{collection:'adData'});


module.exports=mongoose.model("AdData",adSchema);