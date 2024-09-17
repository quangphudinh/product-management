module.exports.priceNewProducts =  (products) => {
    const newProducts = products.map(item => {
        item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(2);
        return item;
    })
    return newProducts
}