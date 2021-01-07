var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var Selectedschema = new Schema(
{
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }]
}
,{
    timestamps:true
}

);
var Selecteds =mongoose.model('Selected',Selectedschema );
module.exports = Selecteds ;