const express = require('express');
const router = express.Router();

//multer and cloudinary
const multer = require('multer');
const upload = multer()

const controller = require('../../controllers/admin/setting.controller');
const uploadCloud = require('../../middlewares/admin/uploadCloudinary.middlewares');

router.get('/general', controller.general);

router.patch('/general', 
            upload.single('logo'), 
            uploadCloud.upload, 
            controller.generalPatch);

module.exports = router;