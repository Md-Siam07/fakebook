const mongoose = require('mongoose');

const Story = mongoose.model('Story');
const fs = require('fs');
const directory = "./uploads";
const path = require('path');
require('dotenv').config();
var axios = require('axios');

var Minio = require('minio');

let minioClient = new Minio.Client({
	endPoint: process.env.endPoint,
	port: 9000,
	accessKey: process.env.accessKey,
	secretKey: process.env.secretKey,
	useSSL: false
});

let minioBucketName = 'stories';


(async () => {
    console.log(`Creating Bucket: ${minioBucketName}`);
    await minioClient.makeBucket(minioBucketName, "hello-there").catch((e) => {
        console.log(
            `Error while creating bucket '${minioBucketName}': ${e.message}`
        );
    });

    console.log(`Listing all buckets...`);
    const bucketsList = await minioClient.listBuckets();
    console.log(
        `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`
    );
})();

const authUrl = "http://account-service:3000/api/auth/verifyJWT";

async function verifyToken(request) {
    //console.log(request.headers['authorization'].split(' ')[1])
    let response;
    await axios.post(authUrl, request)
        .then(res => {
            //console.log('tt2: ', res);
            response = res;
        })
        .catch(error => {
            console.log(error);
        });
   // console.log(response);
    return response;
}

module.exports.uploadStory = async (req, res) => {
    console.log("called")
    var authRes = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    //console.log("called")
    var story = new Story();
    story.fullName = authRes.data.fullName;
    let dummyTime = Date.now().toString();
    story.time = dummyTime;
    let dummyURL = authRes.data.fullName.split(' ').join('_') + '_' + dummyTime;
    story.storyURL = req.file.filename;
    story.email = authRes.data.email;
    story.save((err, doc) => {
        if(!err){
            minioClient.fPutObject(minioBucketName, req.file.filename, req.file.path, function (err, objInfo) {

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
            data = !data ? new Buffer.from(chunk) : Buffer.concat([data, chunk]);
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

module.exports.retriveStories = async (req, res, next) => {
    var authRes = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    const email = authRes.data.email;
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