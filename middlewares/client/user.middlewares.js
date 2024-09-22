const User = require("../../models/user.model");
module.exports.inforUser = async (req, res, next) => {
    if(req.cookies.tokenUser) {
        
        const user = await User.findOne({ 
            tokenUser : req.cookies.tokenUser,
            deleted: false,
            status :  "active"
        }).select("-password");
        
        if(user) {
            res.locals.user = user;
            console.log(res.locals.user);
        }
    }
    next();
}