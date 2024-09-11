const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render('admin/pages/roles/index.pug', {
        titlePage: "Nhóm quyền",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create.pug', {
        titlePage: "Tạo nhóm quyền"
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const data = req.body;
    const record = new Role(data);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            deleted: false,
            _id: id
        }
        const record = await Role.findOne(find);
        res.render('admin/pages/roles/edit.pug', {
            titlePage: "Chỉnh sửa nhóm quyền",
            record: record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        req.flash("success", "Cấp nhật thanh cong nhóm quyên")
    } catch (error) {
        req.flash("error", "Cấp nhật that bai nhóm quyên")
    }
    res.redirect("back")
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);
    res.render('admin/pages/roles/permissions.pug', {
        titlePage: "Phan quyen",
        records: records
    })
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        req.flash("success", "Cấp nhật thành công phân quyền")
    } catch (error) {
        req.flash("error", "Cấp nhật thất bại")
    }

    res.redirect("back")
}