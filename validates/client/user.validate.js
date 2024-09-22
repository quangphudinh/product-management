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

    next(); //chạy tiếp phần sau (controller.createPost) trong router
}