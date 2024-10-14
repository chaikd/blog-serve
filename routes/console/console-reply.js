var express = require('express');
var router = express.Router();
const currentUser = require('../../public/javascripts/currentuser');
const Reply = require('../../public/javascripts/mongo').Reply;
const Comment = require('../../public/javascripts/mongo').Comment;

router.get('/replices/:id', function (req, res, next) {
    Reply.find({'commentId': req.params.id}, (err, result) => {
        if(err => {
            return res.send(err);
        })
        return res.send(result)
    })
})

router.put('/replices/:id', function(req,res, next){
    Reply.findOneAndUpdate({'_id': req.params.id}, {publish: req.body.publish}, {new: true}, (err, doc) => {
        if(err) {
            return res.send(err);
        };
        return res.send(doc);
    })
}) 

router.delete('/:targetId/replices/:id', function(req,res, next){
    Reply.deleteOne({'_id': req.params.id}, (err, doc) => {
        if(err) {
            return res.send(err);
        };
        Comment.findOneAndUpdate({'_id': req.params.targetId}, {$inc:{replicesCount: -1}}, (err, doc)=> {
            if(err) {
                return res.send(err);
            };
            return res.send({success: 1});
        })
    })
}) 

module.exports = router;