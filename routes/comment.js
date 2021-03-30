var express = require('express');
var router = express.Router();
const currentUser = require('../public/javascripts/currentuser');
const Comment = require('../public/javascripts/mongo').Comment;
const Reply = require('../public/javascripts/mongo').Reply;

router.post('/:id/replices', function (req, res, next) {
    if(!req.cookies||!req.cookies._token) {
        res.status(401).send({message: '没有权限'});
        return;
    }
    currentUser(req.cookies).then(result => {
        let comment = new Comment({
            ...req.body,
            createdBy: {
                _id: result._id,
                userName: result.userName
            },
            targetId: req.params.id,
            createdTime: new Date().getTime()
        });

        comment.save((err, product) => {
            if(err) {
                return res.send(err)
            }
            return res.send({success: 1});
        })
    })
})

router.get('/:id/replices', function (req, res, next) {
    Comment.find({'targetId': req.params.id, 'publish': true}, (err, result) => {
        if(err => {
            return res.send(err);
            return;
        })
        return res.send(result)
    })
})

module.exports = router;