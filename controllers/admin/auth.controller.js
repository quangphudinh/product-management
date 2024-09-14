const md5 = require('md5'); // trình mã hóa mật khẩu
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

//[GET] /admin/auth/login
module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render('admin/pages/auth/login', {
            pageTitle: 'Đăng nhâp'
        });
    }

}

//[POST] /admin/auth/login
module.exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // const { email, password } = req.body;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash('error', 'Email không tồn tại');
        res.redirect("back")
        return
    }

    if (md5(password) !== user.password) {
        req.flash('error', 'Mật không trùng khớp');
        res.redirect("back")
        return
    }

    if (user.status == "unactive") {
        req.flash('error', 'Tài khoản chính sách đã bị khóa');
        res.redirect("back")
        return
    }
    res.cookie('token', user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

//[GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}