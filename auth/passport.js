const bcrypt = require("bcrypt");
const passport = require("passport");
LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

const loginCheck = passport => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            //Check customer
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: "No user with that email" });
                    }
                    //Match Password
                    bcrypt.compare(password, user.password, (error, isMatch) => {
                        if (error) throw error;
                        if (isMatch && (user.isHOD || user.isVerified)) {
                            return done(null, user);
                        } 
                        else if (isMatch && !user.isVerified) {
                            return done(null, false, { message: "Not Verified by HOD" });
                        }
                        else {
                            return done(null, false, { message: "Invalid Password" });
                        }
                    });
                })
                .catch((error) => console.log(error));
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
        return;
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
            return;
        });
    });
};
module.exports = { loginCheck };