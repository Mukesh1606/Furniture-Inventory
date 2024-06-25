const User = require('../models/user');
var a=0;
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/HOD/login");
}


const checkNotAuthenticated = async (req, res, next) => {
    // console.log(req.body.email);
    const sesEmail = await User.findOne({email: req.body.email});
    if (sesEmail!=null){
        if (sesEmail.isHOD){
            a=1;
        }
        else{
            a=0;
        }
    }
    console.log(a);
    console.log(sesEmail);
    if (req.isAuthenticated() && a==1) {
        return res.redirect("/HOD/dashboard");
    }
    if (req.isAuthenticated() && a==0) {
        return res.redirect("/Staff/dashboard");
    }
    next()
}

module.exports = { checkAuthenticated, checkNotAuthenticated };