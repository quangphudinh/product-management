const mongoose = require('mongoose');

const settingGeneralSchema = new mongoose.Schema(
    {
        websiteName : String,
        logo : String,
        email : String,
        phone : String,
        address : String,
        copyright : String
    } ,{
        timestamps : true
    }
)
const SettingGeneral = mongoose.model('SettingGeneral', 
        settingGeneralSchema, 'settings-general');
module.exports = SettingGeneral;
