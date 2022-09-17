const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwtHelper = require('../config/jwtHelper');

const userController = require('../controllers/user.controller');
const statusController = require('../controllers/status.controller');
const storyController = require('../controllers/story.controller');

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


router.post('/register', userController.register);
router.post('/authenticate', userController.authenticate);
router.get('/userProfile', jwtHelper.verifyJwtToken ,userController.userProfile);
router.post('/createStatus', statusController.createStatus);
router.get('/getStatus/:email', statusController.getStatus);
router.post('/story', upload.single('image'), storyController.uploadStory);
router.get('/story/:url', storyController.getStory);
router.get('/stories/:email', storyController.retriveStories);

module.exports = router;