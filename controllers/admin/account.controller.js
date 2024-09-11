const md5 = require('md5'); // trình mã hóa mật khẩu
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Account.find(find).select('-password -token');

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });

        record.role = role;
    }

    res.render('admin/pages/accounts/index.pug', {
        titlePage: "Danh sách tài khoản",
        records: records
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false });

    res.render('admin/pages/accounts/create.pug', {
        titlePage: "Tạo tài khoản",
        roles: roles
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExists = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExists) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();

        req.flash('success', 'Thêm thành công tài khoản');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await Account.findOne({
            _id: req.params.id,
            deleted: false
        });
        const roles = await Role.find({ deleted: false });

        res.render('admin/pages/accounts/edit.pug', {
            titlePage: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const emailExists = await Account.findOne({
        _id: { $ne: req.params.id }, // Tìm những bản ghi có giá trị khác id hiện tại
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
        await Account.updateOne({ _id: req.params.id }, data);
        req.flash('success', 'Cấp nhật thành công');
    }
    res.redirect(`back`)
}