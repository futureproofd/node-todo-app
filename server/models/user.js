const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
        email:{
            type: String,
            required: true,
            minlength: 1,
            trim: true,
            unique: true,
            validate:{
                validator:(value)=>{
                    return validator.isEmail(value);
                },
                message:'{VALUE} is not a valid email'
            }
        },
        password:{
            type:String,
            required: true,
            minlength:6
        },
        tokens:[{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]
    }
);

userSchema.pre('save', function(next){
    user = this;
    if(user.isModified('password')){
        //generate a hashed/w salt pw
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

userSchema.statics.findByToken = function(token){
    //model instance
    var User = this;
    var decoded;
    
    try{
        decoded = jwt.verify(token,'abc123');
    }catch(e){
        return Promise.reject();
    }
    //returns a promise
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

userSchema.statics.findByCredentials = function(email,password){
    var User = this;
    //return promise to server
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        //try bcrypt in a promise (not supported by default)
        return new Promise((resolve, reject) =>{
            //compare a users plaintext input to our hashed DB value
            bcrypt.compare(password, user.password, (err,res)=>{
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            });
        })
    });
};

//To transform the object returned to the user (minus password)
userSchema.methods.toJSON = function (){
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj,['_id','email']);
}

userSchema.methods.generateAuthToken = function(){
    //'this' is the calling object - the User
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();
    //update user model
    user.tokens = user.tokens.concat([{access, token}]);

    //returns our token as a promise
    return user.save().then(()=>{
        return token;
    });
};

userSchema.methods.removeUserToken = function(token){
    var user = this;

    return user.update({
        $pull: {
            tokens:{token}
        }
    });
};

var User = mongoose.model('User', userSchema);

module.exports = {User};