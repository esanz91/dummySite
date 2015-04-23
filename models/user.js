var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: "first name is required."
    },
    lastName: {
        type: String,
        required: "last name is required."
    },
    email: {
        type: String,
        required: "email is required.",
        unique: true
    },
    loggedIn: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.getName = function(){
    return this.firstName + " " + this.lastName;
};

var User = mongoose.model('User', userSchema);

module.exports = User;