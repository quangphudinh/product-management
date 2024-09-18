const ProductCategory = require('../models/product-category.model');

module.exports.getSubCategory = (parentID) => {
    const getCategory = async (parentID) => {
        const subs = await ProductCategory.find({
            parent_id: parentID,
            deleted: false,
            status: "active"
        })

        let allSub = [...subs]


        for (const sub of subs) {
            const childs = await getCategory(sub.id);
            allSub = allSub.concat(childs)
        }

        return allSub;
    }
    const result = getCategory(parentID);
    return result
}
