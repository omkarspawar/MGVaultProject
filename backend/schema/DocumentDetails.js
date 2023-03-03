const mongoose = require('mongoose');


const DocumentDetails = mongoose.Schema({
    UserId:{
        type: Number,
        required: true,
    },
    DocumentName:{
        type: String,
        required: true,
    },
    DocumentUrl:{
        type: String,
        required: true,
    },
    DocumentPassword:{
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('DocumentDetails', DocumentDetails)