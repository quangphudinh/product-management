module.exports.loginPost = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        req.flash('error', 'Vui lòng điền đầy đủ thông tin')
        return res.redirect("back")
    }

    next()
}