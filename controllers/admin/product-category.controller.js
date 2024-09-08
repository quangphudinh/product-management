const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    //Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);

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
    //  const countProducts = await ProductCategory.countDocuments(find);
    //  let objectPagination = paginationHelper({
    //      limitItem: 4,
    //      currentPage: 1
    //  }, req.query, countProducts)

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }else{
        sort.position = "desc"
    }

    const records = await ProductCategory.find(find)
        .sort(sort)
        // .limit(objectPagination.limitItem)
        // .skip(objectPagination.skip);
    
    const newRecords = createTreeHelper.treeProducts(records);

    res.render("admin/pages/product-category/index.pug", {
        titlePage: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        // pagination: objectPagination
    })
}

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status })

    req.flash("success", "Cập nhật trạng thái thành công")

    res.redirect("back")
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm`)
            break;
        case "unactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "unactive" })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            // await Product.deleteMany({_id : {$in : ids}})
            // break;
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            })
            req.flash("success", `Xóa thành công cho ${ids.length} sản phẩm`)
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await ProductCategory.updateOne({ _id: id }, {
                    position: position
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
    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    })
    req.flash("success", `Xóa thành công  sản phẩm`)
    // phương thức xóa Item này trong csdl luôn (xóa cứng)
    // await Product.deleteOne({_id : id})
    res.redirect("back")
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const record = await ProductCategory.find(find);
    const newRecords = createTreeHelper.treeProducts(record);

    res.render("admin/pages/product-category/create.pug", {
        titlePage: "Tạo danh mục sản phẩm",
        record: newRecords
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

// [GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const record = await ProductCategory.find(
            {
                deleted : false
            }
        );
        const newRecords = createTreeHelper.treeProducts(record);

        const data = await ProductCategory.findOne(find);
        // console.log(product)
        res.render("admin/pages/product-category/edit.pug", {
            titlePage: "Chỉnh sửa danh mục",
            data: data,
            record: newRecords
        })
    } catch (error) {
        req.flash("error", "Khong tim thay danh mục san pham")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/product-category/edit
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    // console.log(req.body)
    // console.log(req.file)
    
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }

    try {
        await ProductCategory.updateOne({ _id: id }, req.body)
        req.flash("success", "Cập nhật danh mục sản phẩm thành công!")
    } catch (error) {
        req.flash("error", "Thất bại , hãy thử lại ??")
    }
    res.redirect("back")
}

// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await ProductCategory.findOne(find);
        // console.log(product)
        res.render("admin/pages/product-category/detail.pug", {
            titlePage: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}