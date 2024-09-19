const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products.js')
//[GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword

    let newProducts = []
    if(keyword){
        const regex = new RegExp(keyword, 'i')
        newProducts = await Product.find({
            title : regex ,
            deleted : false,
            status : "active"
        })
    }
    // console.log(newProducts)
    newProducts = productsHelper.priceNewProducts(newProducts)
    res.render('client/pages/search/index.pug', {
        titlePage: "Kết quả tìm kiếm",
        keyword : keyword,
        products : newProducts
    })
}