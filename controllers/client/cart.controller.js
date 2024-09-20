const Cart = require('../../models/cart.model')
//[POST] /cart/add/productId
module.exports.add = async (req, res) => {
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)
    const cartId = req.cookies.cartId

    console.log(productId, quantity, cartId)

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