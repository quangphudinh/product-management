const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sentMail");


//[GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/user/register.pug',{
        titlePage : "Đăng ký tài khoản"
    });
}

//[POST] /user/register
module.exports.registerPost =  async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    })
    if(existEmail) { 
        req.flash('error', 'Email đã tồn tại');
        return res.redirect('back');
    }

    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie('tokenUser', user.tokenUser);

    res.redirect("/")
}

//[GET] /user/login
module.exports.login = (req, res) => {
    res.render('client/pages/user/login.pug',{
        titlePage : "Đăng nhâp"
    });
}

//[POST] /user/login
module.exports.loginPost =  async (req, res) => {
    const {email , password} = req.body
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect('back');
    }
    if(md5(password) !== user.password) {
        req.flash('error', 'Mật khẩu không đúng');
        return res.redirect('back');
    }
    if(user.status == "unactive") {
        req.flash('error', 'Tài khoản đang bị khoá');
        return res.redirect('back');
    }

    res.cookie('tokenUser', user.tokenUser);
    res.redirect("/")
}

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('tokenUser');
    res.redirect("/")
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render('client/pages/user/forgot-password.pug', {
        titlePage: 'Lấy lại mật khẩu'
    })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash('error', 'Email không tồn tại');
        return res.redirect('back');
    }

    // Lưu thông tin vào DB
    const otp = generateHelper.generateRandomNumber(4)
    const objectForgotPassword = {
        email : email,
        OTP : otp,
        expireAt : Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    // nếu tồn tại email thì gửi mã OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu !!"
    const html = `
        <h1>Mã OTP của bạn là : <b>${otp}</b></h1>
        <p>Mã OTP sẽ hết hiệu lực sau 5 phút</p>
    `
    sendMailHelper.sendMail(email , subject , html);

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email
    res.render('client/pages/user/otp-password.pug', {
        titlePage: 'Xác nhận OTP',
        email : email
    })
}

// [POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    console.log(email, otp)

    const result = await ForgotPassword.findOne({
        email : email,
        OTP : otp
    })
    if(!result) {
        req.flash('error', 'OTP đã hết hiệu lực');
        return res.redirect('back');
    }
    
    const user = await User.findOne({
        email : email
    })

    res.cookie('tokenUser', user.tokenUser);
    res.redirect("/user/password/reset")
}

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render('client/pages/user/reset-password.pug', {
        titlePage: 'Thay đổi mật khẩu'
    })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const tokenUser = req.cookies.tokenUser
    console.log(password, confirmPassword)
    if(password !== confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không đúng');
        return res.redirect('back');
    }

    await User.findOneAndUpdate({
        tokenUser : tokenUser
    }, {
        password : md5(password)
    })
    
    // res.clearCookie('tokenUser');
    res.redirect('/')
}