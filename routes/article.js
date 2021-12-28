const express = require('express');
const multiparty = require('multiparty');
const router = express.Router();
const qiniu = require('qiniu');
const Article = require('../public/javascripts/mongo').Article;
const Tag = require('../public/javascripts/mongo').Tag;
const Comment = require('../public/javascripts/mongo').Comment;
const qiniuUpload = require('../public/javascripts/qiniu');

router.get('/', function (req, res, next) {
    const pagination = req.query;
    const tag = pagination.selectedTag ? { tag: pagination.selectedTag, publish: 1 } : { publish: 1};
    Article.find(tag).sort('-createTime').skip((Number(pagination.currentPage) - 1) * Number(pagination.size)).limit(Number(pagination.size)).exec(function (err, data) {
        if (err) {
            return res.send(err)
        }
        Article.countDocuments(tag, function (err, result) {
            data = data.map(v => {
                return {
                    _id: v._id,
                    createTime: v.createTime,
                    tag: v.tag,
                    title: v.title,
                    updateTime: v.updateTime,
                    cover: v.cover,
                    description: v.description
                };
            })
            return res.send({content: data, total: result, currentPage: Number(pagination.currentPage), size: Number(pagination.size)})
        })
    })
});

router.get('/tags', function (req, res, next) {
    Article.aggregate([{
        $match: {
            'publish': 1
        },
    },{
        $group: {
            _id: '$tag',
            count: {$sum: 1}
        }
    }], function (err, result) {
        if (err) {
            throw new Error(err);
        } 
        Tag.find(function (err, data) {
            const b = data.map(v => {
                const a = result.find(item => {
                    return item._id == v._id
                });
                return a ? { _id: v._id, count: a.count , name: v.name } : {_id: v._id, count: 0 , name: v.name}; 
            })    
            return res.send(b)
        })    
})
})

router.get('/:id', function (req, res, next) {
    Article.findOne({ _id: req.params.id }, function(err, data) {
        if(err) {
            return res.send(err)
            return;
        }
        // return res.send(data)
        Comment.countDocuments({'targetId': req.params.id, 'publish': true}, (err, count) => {
            if(err) {
                return res.send(err)
                return;
            }
            data.commentCount = count || 0;
            return res.send(data)
        })
    }) 
})


module.exports = router;
