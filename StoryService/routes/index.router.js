const express = require('express');
const router = express.Router();
const multer = require('multer');

const storyController = require('../controllers/story.controller');

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

router.post('/story',  upload.single('image'), storyController.uploadStory);
router.get('/story',  storyController.retriveStories);
router.get('/story/image/:url', storyController.getStory);

module.exports = router;