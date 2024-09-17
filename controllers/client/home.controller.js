const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products.js')

// [GET] /
module.exports.index = async (req, res) => {
    //Lấy ra sản phẩm nối bật
    const productsFeatured = await Product.find({
        deleted: false,
        featured: "1",
        status: "active"
    })
    const newproductsFeatured = productsHelper.priceNewProducts(productsFeatured);
    
    //Lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active",  
    }).sort({position : "desc"}).limit(6); //lấy ra tối đa 4 phần tử
    const newProductsNew = productsHelper.priceNewProducts(productsNew);

    res.render('client/pages/home/index.pug', {
        titlePage: "Trang Chu",
        productsFeatured : newproductsFeatured,
        productsNew : newProductsNew
    })
}