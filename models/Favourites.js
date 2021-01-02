var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var favouriteSchema = new Schema(
{
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies'
    }]
}
,{
    timestamps:true
}

);
var favourites =mongoose.model('favourite',favouriteSchema );
module.exports = favourites ;