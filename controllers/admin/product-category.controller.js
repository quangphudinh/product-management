const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    res.render("admin/pages/product-category/index.pug", {
        titlePage: "Danh mục sản phẩm",
        records: records
    })
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-category/create.pug", {
        titlePage: "Tạo danh mục sản phẩm"
    })
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    // console.log(req.body)
    if (req.body.position === "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Them thanh cong san pham")
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)

}