const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const productsHelper = require('../../helpers/products.js')

const productsCategoryHelper = require("../../helpers/products-category.js")
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status : "active",
        deleted : false
    })
    .sort({position : "desc"});

    const newProducts = productsHelper.priceNewProducts(products);
    
    // console.log(newProducts);

    res.render('client/pages/products/index.pug',{
        titlePage : "Trang San Pham",
        products : newProducts
    })
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find);
        // console.log(product)
        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })

            product.category = category
        }
        
        product.priceNew = productsHelper.priceNewProduct(product);

        res.render('client/pages/products/detail.pug', {
            titlePage: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug : req.params.slugCategory
    })

    // console.log(category.title)

    
    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);
    // console.log(listSubCategoryId)

    const products = await Product.find({
        status : "active",
        deleted : false,
        product_category_id : {$in :[category.id , ...listSubCategoryId]}
    })
    .sort({position : "desc"});

    const newProducts = productsHelper.priceNewProducts(products);
    res.render('client/pages/products/index.pug',{
        titlePage : category.title,
        products : newProducts
    })
}


