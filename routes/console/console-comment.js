var express = require('express');
var router = express.Router();
const currentUser = require('../../public/javascripts/currentuser');
const Comment = require('../../public/javascripts/mongo').Comment;
const Reply = require('../../public/javascripts/mongo').Reply;

router.get('/:id/replices', function (req, res, next) {
    Comment.find({'targetId': req.params.id}, (err, result) => {
        if(err => {
            return res.send(err);
            return;
        })
        return res.send(result)
    })
})

router.put('/:id/replices/:commentId', function(req,res, next){
    Comment.findOneAndUpdate({'_id': req.params.commentId}, {publish: req.body.publish}, {new: true}, (err, doc) => {
        if(err) {
            return res.send(err);
            return;
        };
        return res.send(doc);
    })
}) 

router.delete('/:id/replices/:commentId', function(req,res, next){
    Comment.deleteOne({'_id': req.params.commentId}, (err, result) => {
        if(err) {
            return res.send(err);
            return;
        };
        Reply.remove({'commentId': req.params.commentId}, (err, result) => {
            if(err) {
                return res.send(err);
                return;
            }
            return res.send({success: 1});
        })
    })
}) 

module.exports = router;