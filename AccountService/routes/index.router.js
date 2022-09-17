const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwtHelper = require('../config/jwtHelper');

const userController = require('../controllers/user.controller');

// const upload = multer({ dest: 'uploads/' })

const DIR = './uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR)
  },
  filename: (req, file, cb) => {
    const fileName =  Date.now().toString() + file.originalname.toLowerCase().split(' ').join('-') 
    cb(null, fileName)
  },
})


const upload = multer({
    storage: storage,
});

router.use(express.static(__dirname + "./uploads/"));


router.post('/auth/register', userController.register);
router.post('/auth/authenticate', userController.authenticate);
router.post('/auth/verifyJWT', jwtHelper.verifyJwtToken);

module.exports = router;