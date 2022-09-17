const mongoose = require('mongoose');

const Status = mongoose.model('Status');

module.exports.createStatus = (req, res) => {
    var status = new Status();
    status.fullName = req.body.fullName;
    status.email = req.body.email;
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
            console.log('error occured');
        }} 
    )
}


module.exports.getStatus = (req, res) => {
    const email = req.params.email;
    q = Status.find({email: {$ne: email}}).sort({time: -1}).limit(10);
    q.exec( (err, doc) => {
        if(!err){
            res.send(doc)
        }
        else{
            console.log("error")
        }
    })
}
