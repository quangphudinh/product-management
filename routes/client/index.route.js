const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./search.route');
const categoryMiddlewares = require('../../middlewares/client/category.middlewares');
const cartMiddlewares = require('../../middlewares/client/cart.middlewares');
const cartRoutes = require('./cart.route');
const checkoutRoutes = require('./checkout.route');
const userRoutes = require('./user.route');

module.exports = (app) => {
    app.use(categoryMiddlewares.category); //viết dòng này để sử dụng middleware cho tất cả route
    app.use(cartMiddlewares.CartID);
    app.use('/', homeRoutes);
    app.use('/products',productRoutes); 
    app.use('/search', searchRoutes);
    app.use("/cart", cartRoutes);
    app.use("/checkout", checkoutRoutes);
    app.use("/user", userRoutes);
}