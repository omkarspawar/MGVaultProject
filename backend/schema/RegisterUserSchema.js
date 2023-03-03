const mongoose = require('mongoose');


const RegisterUserSchema = mongoose.Schema({
    UserId:{
        type: Number,
    },
    UserName:{
        type: String,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('RegisterUser_S', RegisterUserSchema)