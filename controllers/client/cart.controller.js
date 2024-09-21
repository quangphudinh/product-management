const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products.js')
//[GET]/cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })
    
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id;
            const productInfor = await Product.findOne({
                _id: productId,
                deleted: false,
                status: "active"
            }).select("title thumbnail slug price discountPercentage")

            productInfor.priceNew = productsHelper.priceNewProduct(productInfor);
            item.productInfor = productInfor;
            item.totalPrice = item.productInfor.priceNew * item.quantity
        }
        cart.cartTotalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0);
    }

    res.render('client/pages/cart/index.pug', {
        titlePage: "Giỏ hàng",
        cartDetail : cart
    })
}
//[POST] /cart/add/productId
module.exports.add = async (req, res) => {
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)
    const cartId = req.cookies.cartId

    // console.log(productId, quantity, cartId)

    const cart = await Cart.findOne({
        _id: cartId
    })


    const existProductInCart = cart.products.find(product => product.product_id == productId)
    if (existProductInCart) {
        const quantityNew = existProductInCart.quantity + quantity;
        await Cart.updateOne({
                _id: cartId,
                "products.product_id" : productId
            },{
                $set: {
                    "products.$.quantity": quantityNew
                }
            }
        )
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            })
    }


    req.flash("success", "Them san pham vao gio hang thanh cong")
    res.redirect("back")
}
//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId
    const cartId = req.cookies.cartId

    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            $pull: { products: { product_id: productId } }
        })
    

    console.log(productId , cartId)
    req.flash("success", "Xoa san pham thanh cong")
    res.redirect("back")
}

//[GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = req.params.quantity
    
    await Cart.updateOne({
        _id: cartId,
        "products.product_id" : productId
    },{
        $set: {
            "products.$.quantity": quantity
        }
    }
)
    req.flash("success", "Cap nhat so luong san pham thanh cong")
    res.redirect("back")
}