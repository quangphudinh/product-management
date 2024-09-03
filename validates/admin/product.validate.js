module.exports.createPost = (req, res , next) => {
    if(!req.body.title){
        req.flash("error", "Vui lòng nhập tên sản phẩm")
        res.redirect("back")
        return;
    }

    next(); //chạy tiếp phần sau (controller.createPost) trong router
}
