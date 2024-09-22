const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const productsHelper = require('../../helpers/products');
//[GET] /checkout
module.exports.index =  async(req, res) => {
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

    res.render('client/pages/checkout/index.pug', {
        titlePage: "Thanh Toán",
        cartDetail : cart
    })
}

//[POST] /checkout/order
module.exports.order = async(req, res) => {
    const cartId = req.cookies.cartId
    const userInfor = req.body

    const cart = await Cart.findOne({
        _id: cartId
    })

    const products = []
    for(const product of cart.products){
        const objectProduct = {
            product_id : product.product_id,
            quantity : product.quantity,
            price : 0,
            discountPercentage : 0
        }

        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("price discountPercentage")
        objectProduct.price = productInfor.price
        objectProduct.discountPercentage = productInfor.discountPercentage

        products.push(objectProduct)
    }
   
    // console.log(cartId)
    // console.log(userInfor)
    // console.log(products)

    const orderInfor = {
        cart_id : cartId,
        userInfo : userInfor,
        products : products
    }

    const order = new Order(orderInfor)
    await order.save()

    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            $set: {
                products: []
            }
        }
    )

    res.redirect(`/checkout/success/${order._id}`)
}

//[GET] /checkout/success/:orderId
module.exports.success = async(req, res) => {
    const orderId = req.params.orderId
    const order = await Order.findOne({
        _id: orderId
    })

    for(const product of order.products){
        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")

        product.productInfor = productInfor
        product.priceNew = productsHelper.priceNewProduct(product)
        product.totalPrice = product.priceNew * product.quantity
    }

    order.orderTotalPrice = order.products.reduce((total, item) => 
        total + item.totalPrice, 0)

    
    res.render('client/pages/checkout/success.pug', {
        titlePage: "Đặt hàng thành công",
        order : order
    })
}