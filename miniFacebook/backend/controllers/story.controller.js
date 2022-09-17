const mongoose = require('mongoose');

const Story = mongoose.model('Story');
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');
const directory = "./uploads";
const path = require('path');

var Minio = require('minio');

let minioClient = new Minio.Client({
	endPoint: "127.0.0.1",
	port: 9000,
	accessKey: "azKKrsU1mp8SGjFd",
	secretKey: "tA4wjE451fk1jhpXhIZDcfBBU6iBDHRU",
	useSSL: false
});

let minioBucketName = 'stories';

minioClient.bucketExists(minioBucketName, function(err) {
	if (err) {
		if (err.code == 'NoSuchBucket') {
			minioClient.makeBucket(minioBucketName, 'us-east-1', function(err2) {
				if (err2) {
					console.log("error on creating bucket", err2);
				}
			});
		}
	}
	console.log('Bucket exists:', minioBucketName);
});

module.exports.uploadStory = (req, res) => {
    //console.log("called")
    var story = new Story();
    story.fullName = req.body.fullName;
    let dummyTime = Date.now().toString();
    story.time = dummyTime;
    let dummyURL = req.body.fullName.split(' ').join('_') + '_' + dummyTime;
    story.storyURL = req.file.filename;
    story.email = req.body.email;
    story.save((err, doc) => {
        if(!err){
            minioClient.fPutObject('stories', req.file.filename, req.file.path, function (err, objInfo) {

                if (err) {
                    return console.log(err)
                }
                fs.readdir(directory, (err, files) => {
                    if (err) throw err;
                  
                    for (const file of files) {
                      fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                      });
                    }
                  });
            });
        
            res.send(doc);
        }
        else{
            console.log("error in posting story");
        }
    })
}

module.exports.getStory = (req, res, next) => {
    let data;
    minioClient.getObject(minioBucketName, req.params.url, function(err, objStream) {
        if (err) {
            return console.log(err)
        }
        objStream.on('data', function(chunk) {
            data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
        })
        objStream.on('end', function() {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(data);
            res.end();
        })
        objStream.on('error', function(err) {
            res.status(500);
            res.send(err);
        })
    });
}

module.exports.retriveStories = (req, res, next) => {
    const email = req.params.email;
    q = Story.find({email: {$ne: email}}).sort({time: -1}).limit(10);
    q.exec( (err, doc) => {
        if(!err){
            res.send(doc)
        }
        else{
            console.log("error")
        }
    })
}