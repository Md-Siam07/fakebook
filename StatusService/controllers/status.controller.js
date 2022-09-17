const mongoose = require('mongoose');

const Status = mongoose.model('Status');

var axios = require('axios');

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

module.exports.createStatus = async (req, res) => {
    var authRes = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    //console.log(authRes)
    
    var status = new Status();
    status.fullName = authRes.data.fullName;
    status.email = authRes.data.email;
    status.status = req.body.status;
    status.time = Date.now().toString();
    // console.log(status);
    status.save( 
        (err, doc) =>{
        if(!err){
                //console.log(doc)
            res.send(doc)
        }
        else{
                console.log(err);
                console.log('error occured');
        }} 
    )
    
}


module.exports.getStatus = async (req, res) => {
    var authRes = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    //console.log(authRes.data)
    // if(authRes.data.status == true){
        const email = authRes.data.email;
        q = Status.find({email: {$ne: email}}).sort({time: -1}).limit(10);
        q.exec( (err, doc) => {
            if(!err){
                res.send(doc)
            }
            else{
                console.log("error")
            }
        })

   // res.send(authRes);
    
}
