var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    //returns a promise
    User.findByToken(token).then((user) => {
        if(!user){
            //token match, but no user
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    //handle promise rejection
    }).catch((e) =>{
        res.status(401).send(e);
    });
};

module.exports = {authenticate};
