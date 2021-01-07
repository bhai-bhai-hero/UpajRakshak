var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var User = new  Schema({
    firstname: {
        type: String,
          default: ''
      },
      lastname:{
          type: String,
          default : ""
      },
      phoneno:{
          type: Number

      },
      email:{
        type: String,
        default : ""
      },
      state:{
        type: String
      },
      district:{
        type: String
      },
      block:{
        type: String
      },

      facebookId: String,
    admin:{
        type: Boolean,
        default: false
    }
    
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);