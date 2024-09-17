const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    //Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    // console.log(filterStatus);

    let find = {
        deleted: false
    }

    // xử lý sự kiện khi kích vào nút hoạt động / dừng hoạt động để loc ra những sản phẩm đang hoạt động / dừng hoạt động
    if (req.query.status) {
        find.status = req.query.status
    }

    //phần tìm kiếm
    const objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex
    }

    //phần phân trang - pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        limitItem: 4,
        currentPage: 1
    }, req.query, countProducts)

    // end phần phân trang - pagination

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc"
    }
    // End Sort
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const product of products) {
        // Lấy thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        if (user) {
            product.accountFullName = user.fullName;
        }

        // Lấy thông tin người cập nhật gần nhất
        const updateBy = product.updatedBy[product.updatedBy.length - 1];
        if (updateBy) {
            const userUpdate = await Account.findOne({
                _id: updateBy.account_id
            })
            updateBy.accountFullName = userUpdate.fullName
        }
    }

    res.render("admin/pages/products/index.pug", {
        titlePage: "Trang SP",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })

}
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
    })

    req.flash("success", "Cập nhật trạng thái thành công")

    res.redirect("back")
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: { updatedBy: updatedBy }
            })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm`)
            break;
        case "unactive":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "unactive",
                $push: { updatedBy: updatedBy }
            })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            // await Product.deleteMany({_id : {$in : ids}})
            // break;
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            req.flash("success", `Xóa thành công cho ${ids.length} sản phẩm`)
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({ _id: id }, {
                    position: position,
                    $push: { updatedBy: updatedBy }
                })
            }
            break;
        default:
            break;
    }
    res.redirect("back")
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // phương thức xóa chỉ thay đổi thuộc tính "deleted" trong csdl
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", `Xóa thành công  sản phẩm`)
    // phương thức xóa Item này trong csdl luôn (xóa cứng)
    // await Product.deleteOne({_id : id})
    res.redirect("back")
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper.treeProducts(category);

    res.render("admin/pages/products/create.pug", {
        titlePage: "Thêm mới sản phẩm",
        category: newCategory,
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    // kiểm tra để phòng bị đổi dự liệu từ postman
    /*
        const permissions = res.locals.user.permissions;
        if(!permissions.includes("product-create")){
            req.flash("error", "Bạn không có quyền truy cập");
            return res.redirect("back");
        }
        else {
            //chạy đoạn code ở phía dưới
        }
        //làm tương tự với các tính năng khác vào các tính năng post patch delete
    */
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const data = req.body;

    const product = new Product(data);
    await product.save();

    req.flash("success", "Them thanh cong san pham")
    res.redirect(`${systemConfig.prefixAdmin}/products`)

}

// [GET] /admin/products/edit
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const category = await ProductCategory.find(
            {
                deleted: false
            }
        );
        const newCategory = createTreeHelper.treeProducts(category);

        const product = await Product.findOne(find);
        // console.log(product)
        res.render("admin/pages/products/edit.pug", {
            titlePage: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        })
    } catch (error) {
        req.flash("error", "Khong tim thay san pham")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/products/edit
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        })

        req.flash("success", "Cập nhật sản phẩm thành công!")
    } catch (error) {
        req.flash("error", "Thất bại , hãy thử lại ??")
    }
    res.redirect("back")
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        // console.log(product)
        res.render("admin/pages/products/detail.pug", {
            titlePage: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}
