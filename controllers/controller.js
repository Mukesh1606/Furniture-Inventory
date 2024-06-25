const User = require('../models/user');
const Records = require('../models/record');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.firstPage = async(req, res)=>{
    try {
        return res.render('Main');
    } catch (error) {
        return res.render('404');
    }
}

exports.loginView = async (req, res) => {
    try {
        res.render('HOD/Login');
    } catch (error) {
        return res.render('404');
    }
}

exports.staffLoginView = async (req, res) => {
    try {
        res.render('Staff/Login');
    } catch (error) {
        return res.render('404');
    }
}


exports.login = async (req, res) => {
    try {
        const isHODEmail = await User.findOne({email: req.body.email});
        if(isHODEmail.isHOD){
            passport.authenticate("local", {
                successRedirect: "/HOD/dashboard",
                failureRedirect: "/HOD/login",
                failureFlash: true,
            })(req, res);
            return;
        }
    } catch (error) {
        return res.render('404');
    }
}

exports.staffLogin= async (req,res) => {
    try {
        const isStaff = await User.findOne({email: req.body.email});
        if(!isStaff.isHOD){
            passport.authenticate("local", {
                successRedirect: "/Staff/dashboard",
                failureRedirect: "/Staff/login",
                failureFlash: true,
            })(req, res);
            return;
        }
    } catch (error) {
        return res.render('404');
    }
}

//staff register
exports.staffRegister = async(req,res) => {
    try {
        res.render('Staff/Register',{msg:""});
    } catch (error) {
        return res.render('404');
    }
}

//store in db
exports.Register = async(req,res) => {
    try {
        const staff = await User.findOne({email: req.body.email});
        if(!staff){
            await new User({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                password:req.body.password
            }).save();
            return res.render('Staff/Register',{msg: "Registerd Successfully"});
        }
        return res.render('Staff/Register',{msg: "Email Already Exists"});
    } catch (error) {
        return res.render('404');
    }
}

exports.logout = async(req, res, next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/HOD/login');
    });
}

exports.hodDashBoard = async (req, res) => {
    try {
        return res.render('HOD/DashBoard', { user: req.user.firstName });
    } catch (error) {
        return res.render('404');
    }
}

exports.addRecordsView = async(req, res)=>{
    try {
        return res.render('HOD/AddRecords', { user: req.user.firstName, msg: req.flash('infoSubmit') });
    } catch (error) {
        return res.render('404');
    }
}

exports.addRecords = async(req, res)=>{
    try {
        await new Records({
            productName: req.body.pname,
            quantity: req.body.quantity,
            description: req.body.description,
            inVoice: req.body.invoice,
            dop: req.body.dop,
            company: req.body.company,
            rate: req.body.rate,
            taxType: req.body.taxtype,
            percentage: req.body.percent,
            delivery: req.body.delivery,
            cost: req.body.cost,
            warranty: req.body.warranty,
        }).save();
        req.flash('infoSubmit', "Added Successfully");
        return res.redirect('/HOD/addrecords');
    } catch (error) {
        return res.render('404');
    }
}

exports.staffDashBoard = async(req, res)=>{
    try {
        return res.render('Staff/dummy');
    } catch (error) {
        return res.render('404');
    }
}

exports.verifyRecords = async(req, res)=>{
    try {
        var unverifiedRecords = await Records.find({isVerified:false});
        res.render('HOD/VerifyRecords', { user: req.user.firstName, records: unverifiedRecords , msg:req.flash('verified') });
        return;
    } catch (error) {
        return res.render('404');
    }
}

exports.viewRecord = async(req, res)=>{
    try {
        const id = req.params.id;
        const record = await Records.findOne({_id: id});
        return res.render('HOD/ViewRecord', { user: req.user.firstName, record: record, msg: req.flash('modified') });
    } catch (error) {
        return res.render('404');
    }
}

exports.authorizeRecord = async(req, res)=>{
    try {
        var vid = req.body.id;
        var authorize = await Records.findByIdAndUpdate({_id: vid}, {isVerified: true});
        if (authorize==""){
            return res.render("404");
        }
        req.flash('verified', "Authorized!!");
        return res.redirect('/HOD/verifyRecords');
    } catch (error) {
        return res.render('404');
    }
}

exports.editRecord = async(req, res)=>{
    try {
        const id = req.params.id;
        const record = await Records.findOne({_id: id});
        return res.render("HOD/EditRecord", { user: req.user.firstName, record: record });
    } catch (error) {
        return res.render('404');
    }
}

exports.updateRecord = async(req, res)=>{
    try {
        var uid= req.body.id;
        var update = await Records.findByIdAndUpdate({_id: uid}, 
            {
                productName: req.body.pname,
                quantity: req.body.quantity,
                description: req.body.description,
                inVoice: req.body.invoice,
                dop: req.body.dop,
                company: req.body.company,
                rate:req.body.rate,
                taxType: req.body.taxtype,
                percentage: req.body.percent,
                delivery: req.body.delivery,
                cost: req.body.cost,
                warranty: req.body.warranty,
            }
        );
        if (update==""){
            return res.render("404");
        }
        req.flash('modified', "Edited Successfully");
        res.redirect('/HOD/viewrecord/'+uid);
    } catch (error) {
        return res.render('404');
    }
}

exports.verifyStaffPage = async(req, res)=>{
    try {
        var staffData = await User.find({isHOD:false});
        res.render("HOD/VerifyStaff", {user:req.user.firstName, staffData});
        return;
    } catch (error) {
        return res.render('404');
    }
}

exports.verification = async(req, res)=>{
    try {
        var deleteUser= await User.findOneAndUpdate({email:req.body.vemail},{isVerified:true});
        res.redirect("/HOD/verifystaff");
        return;
    } catch (error) {
        return res.render('404');
    }
}

exports.deleteStaff=async(req,res)=>{
    try {
        var deleteUser= await User.deleteOne({email:req.body.email});
        res.redirect("/HOD/verifystaff");
        return;
    } catch(error){
        res.render("404");
        return;
    }
}

exports.approvedRecordsPage = async(req, res)=>{
    try {
        var verifiedRecords = await Records.find({isVerified:true});
        res.render('HOD/ApprovedRecords', { user: req.user.firstName, records: verifiedRecords });
        return;
    } catch (error) {
        return res.render('404');
    }
}
