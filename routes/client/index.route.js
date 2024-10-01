const categoryMiddlewares = require('../../middlewares/client/category.middlewares');
const cartMiddlewares = require('../../middlewares/client/cart.middlewares');
const userMiddlewares = require('../../middlewares/client/user.middlewares');
const settingMiddlewares = require('../../middlewares/client/setting.middleware');
const authMiddleware = require('../../middlewares/client/auth.middlewares');

const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./search.route');
const cartRoutes = require('./cart.route');
const checkoutRoutes = require('./checkout.route');
const userRoutes = require('./user.route');
const chatRoutes = require('./chat.route');

module.exports = (app) => {
    app.use(categoryMiddlewares.category); //viết dòng này để sử dụng middleware cho tất cả route
    app.use(cartMiddlewares.CartID);
    app.use(userMiddlewares.inforUser);
    app.use(settingMiddlewares.settingGeneral);

    app.use('/', homeRoutes);
    app.use('/products',productRoutes); 
    app.use('/search', searchRoutes);
    app.use("/cart", cartRoutes);
    app.use("/checkout", checkoutRoutes);
    app.use("/user", userRoutes);
    app.use("/chat",authMiddleware.requireAuth,chatRoutes); //router pirvate
}