const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');

const categoryMiddlewares = require('../../middlewares/client/category.middlewares');

module.exports = (app) => {

    app.use(categoryMiddlewares.category); //viết dòng này để sử dụng middleware cho tất cả route
    app.use('/', homeRoutes);
    app.use('/products',productRoutes); 
}