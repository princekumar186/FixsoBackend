const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullName:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    phone:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["user","admin","technician"],
        default:"user"
    },

    profileImage:{
        type:String,
        default:""
    },

    address:{
        type:String,
        default:""
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("User",userSchema);
