const md5 = require('md5'); // trình mã hóa mật khẩu
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render('admin/pages/my-account/index.pug', {
        titlePage: "Trang thông tin cá nhân"
    })
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render('admin/pages/my-account/edit.pug', {
        titlePage: "Thay đổi thông tin cá nhân"
    })
}

// [POST] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const emailExists = await Account.findOne({
        _id: { $ne: res.locals.user.id }, // Tìm những bản ghi có giá trị khác id hiện tại
        email: req.body.email,
        deleted: false
    });

    if (emailExists) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        const data = req.body;
        await Account.updateOne({ _id: res.locals.user.id }, data);
        req.flash('success', 'Cấp nhật thông tin thành công');
    }
    res.redirect(`back`)
}