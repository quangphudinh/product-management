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

    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    
    res.render('client/pages/home/index.pug', {
        titlePage: "Trang Chu",
        newProducts : newProducts
    })
}