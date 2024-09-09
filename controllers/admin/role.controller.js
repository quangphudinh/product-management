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