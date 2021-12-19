const mongoose = require('mongoose')

const reiseSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    date1:{
        type: Date,
        required: true
    },
    date2:{
        type: Date,
        required: true
    },
    country:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('reise', reiseSchema)