var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

router.get('/', function (req, res, next) {
    User.find({ loggedIn: true }, function(err, users){
        var context = {
            users: users.map(function(user){
                return {
                    name: user.getName(),
                    email: user.email,
                    loggedIn: user.loggedIn
                }
            })
        };
        res.render('users', context);
    });
});

module.exports = router;