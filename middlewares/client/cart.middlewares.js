const Cart = require('../../models/cart.model');
module.exports.CartID = async (req, res, next) => {
    if(!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const expiresCookie = 365 * 24 * 60 * 60 * 1000;

        res.cookie('cartId', cart._id, { exprires : new Date(Date.now() + expiresCookie), httpOnly: true });
    } else {
        const cart = await Cart.findOne({ _id: req.cookies.cartId });
        cart.totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0);
        res.locals.miniCart = cart
        
    }
    next()

}