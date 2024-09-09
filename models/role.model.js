const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        title : String, //san pham 1
        description : String,
        permissions : {
            type : Array,
            default : []
        },
        deleted : {
            type : Boolean,
            default : false
        },
        deletedAt : Date
    } ,{
        timestamps : true
    }
)
const Role = mongoose.model('Role', roleSchema, 'roles');
module.exports = Role;
