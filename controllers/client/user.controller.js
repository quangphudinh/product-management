const User = require("../../models/user.model");
const md5 = require("md5");
//[GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/user/register.pug',{
        pageTitle : "Đăng ký tài khoản"
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
        pageTitle : "Đăng nhâp"
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