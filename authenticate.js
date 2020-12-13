var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config.js');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};
var opts={};
opts.jwtFromRequest= ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config. secretKey;
exports.jwtPassport= passport.use(new jwtStrategy(opts,(jwt_payload,done)=>
{
    User.findOne({_id:jwt_payload._id},(err , user)=>{
        if(err){
            return done(err ,false);
        }
        else if (user){
            return done(null,user)}
        else
         return done(false,false);
        }
    );
}) );

exports.verifyAdmin = (req,err,next)=>{
          if(req.user.admin)
          {
              next();
          }
          else {
            err = new Error('You are not authorised to perform this operation');
            err.status = 404;
            return next(err);
          }
}
exports.verifyUser = passport.authenticate('jwt', {session: false});