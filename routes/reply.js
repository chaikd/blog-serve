var express = require('express');
var router = express.Router();
const currentUser = require('../public/javascripts/currentuser');
const Reply = require('../public/javascripts/mongo').Reply;
const Comment = require('../public/javascripts/mongo').Comment;

router.post('/replices/:targetId', function (req, res, next) {
    if(!req.cookies||!req.cookies._token) {
        res.status(401).send({message: '没有权限'});
        return;
    }
    currentUser(req.cookies).then(result => {
        Comment.findOneAndUpdate({'_id': req.params.targetId},{$inc:{replicesCount:1}},{new: true}, async (err, comment)=> {
            if(err) {
                return res.send(err);
            }
            let replyObj = {
                ...req.body,
                createdBy: {
                    _id: result._id,
                    userName: result.userName
                },
                commentId: comment._id,
                createdTime: new Date().getTime()
            };
            if(req.body.targetReplyId) {
                await Reply.find({'_id': req.body.targetReplyId}, (err, replice) => {
                    replyObj.repliedUser = replice.createdBy;
                })
            }else {
                replyObj.repliedUser = comment.createdBy;
            }
            let reply = new Reply(replyObj);
            reply.save((err, pro) => {
                if(err) {
                    return res.send(err)
                }
                return res.send({success: 1});
            })
        })
    })
})

router.get('/replices/:id', function (req, res, next) {
    Reply.find({'commentId': req.params.id, publish: true}, (err, result) => {
        if(err => {
            return res.send(err);
        })
        return res.send(result)
    })
})

module.exports = router;