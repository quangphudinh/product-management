const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const ProductCategory = require("../../models/product-category.model")
const Product = require("../../models/product.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct : {
      total : 0,
      active : 0,
      inactive : 0
    },
    product : {
      total : 0,
      active : 0,
      inactive : 0
    },
    account : {
      total : 0,
      active : 0,
      inactive : 0
    },
    user : {
      total : 0,
      active : 0,
      inactive : 0
    }
  }

  statistic.categoryProduct.total = await ProductCategory.countDocuments({deleted : false});
  statistic.categoryProduct.active = await ProductCategory.countDocuments({deleted : false , status : "active"});
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({deleted : false , status : "unactive"});
  
  statistic.product.total = await Product.countDocuments({deleted : false});
  statistic.product.active = await Product.countDocuments({deleted : false , status : "active"});
  statistic.product.inactive = await Product.countDocuments({deleted : false , status : "unactive"});

  statistic.account.total = await Account.countDocuments({deleted : false});
  statistic.account.active = await Account.countDocuments({deleted : false , status : "active"});
  statistic.account.inactive = await Account.countDocuments({deleted : false , status : "unactive"});

  statistic.user.total = await Role.countDocuments({deleted : false});
  statistic.user.active = await Role.countDocuments({deleted : false , status : "active"});
  statistic.user.inactive = await Role.countDocuments({deleted : false , status : "unactive"});


  res.render('admin/pages/dashboard/index.pug' , {
    titlePage : "Trang Tong Quan ADMIN",
    statistic :  statistic
})
  }