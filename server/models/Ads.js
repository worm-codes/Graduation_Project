var mongoose=require("mongoose");

var adSchema=new mongoose.Schema({
	arriving_date_year:{type:Number, required:true},
    arriving_date_month:{type:Number, required:true},
    arriving_date_day:{type:Number, required:true},
    leaving_date_year: {type:Number, required:true},
    leaving_date_month: {type:Number, required:true},
    leaving_date_day: {type:Number, required:true},
    country:{type:String, required:true},
    state: {type:String, required: true},
    city:{type:String, required:true},
    owner_gender:{type:String}, 
    owner_email:{type:String},
    owner_age:{type:Number},  
    owner_id: {type:String},
    description: {type:String, required:true},
    host: {type:String, required:true},
    maxPeople: {type:Number, required:true},
    maxTimeHour: {type: Number, required:true},
    maxTimeMinute: {type: Number, required:true},
    minTimeHour: {type:Number, required:true},
    minTimeMinute: {type:Number, required:true},
    isActive: {type:Boolean, default:true}
    	
},{collection:'adData'});

module.exports=mongoose.model("AdData",adSchema);