const express = require('express');
const router = express.Router();

//multer and cloudinary
const multer = require('multer');
const upload = multer()

const validate = require('../../validates/admin/account.validate');
const uploadCloud = require('../../middlewares/admin/uploadCloudinary.middlewares');

const controller = require('../../controllers/admin/account.controller');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create',
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);

module.exports = router;