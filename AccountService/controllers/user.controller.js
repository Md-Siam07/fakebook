const mongoose = require('mongoose');
const passport = require('passport');
const jwtHelper = require('../config/jwtHelper')
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');


module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save( 
        (err, doc) =>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log(err)
            if(err.code == 11000)
                res.status(422).send(['Duplicate email address found']);
            else
                return next(err);
        }} 
        )
}

module.exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return res.status(400).json(err);
        else if(user) return res.status(200).json({"token": user.generateJwt()});
        else return res.status(404).json(info);
    })(req, res);
}


