module.exports.registerPost = (req, res , next) => {
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập họ tên")
        res.redirect("back")
        return;
    }

    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email")
        res.redirect("back")
        return;
    }

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập password")
        res.redirect("back")
        return;
    }

    next(); 
}

module.exports.loginPost = (req, res , next) => {
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email")
        res.redirect("back")
        return;
    }

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu")
        res.redirect("back")
        return;
    }

    next(); 
}

module.exports.forgotPasswordPost = (req, res , next) => {
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email")
        res.redirect("back")
        return;
    }

    next(); 
}

module.exports.resetPasswordPost = (req, res , next) => {
    if(!req.body.confirmPassword){
        req.flash("error", "Vui lòng xác nhận mật khẩu mới !!")
        res.redirect("back")
        return;
    }

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu mới !!")
        res.redirect("back")
        return;
    }

    next(); 
}
