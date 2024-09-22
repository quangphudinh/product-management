const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
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
        OPT : otp,
        expireAt : Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    // nếu tồn tại email thì gửi mã OTP qua email

    res.send('ok')
}