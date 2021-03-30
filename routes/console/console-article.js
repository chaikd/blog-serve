const express = require('express');
const multiparty = require('multiparty');
const router = express.Router();
const qiniu = require('qiniu');
const Article = require('../../public/javascripts/mongo').Article;
const Tag = require('../../public/javascripts/mongo').Tag;
const Comment = require('../../public/javascripts/mongo').Comment;
const qiniuUpload = require('../../public/javascripts/qiniu');

router.get('/', function (req, res, next) {
    const pagination = req.query;
    const tag = pagination.selectedTag ? { tag: pagination.selectedTag } : {};
    Article.find(tag).skip((Number(pagination.currentPage)-1) * Number(pagination.size)).limit(Number(pagination.size)).exec(function (err, data) {
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
                    updateTime: v.updateTime
                };
            })
            return res.send({content: data, total: result, currentPage: Number(pagination.currentPage), size: Number(pagination.size)})
        })
    })
});

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

router.post('/', function (req, res, next) {
    let article = new Article({
        ...req.body,
        createTime: new Date().getTime(),
        updateTime: new Date().getTime()
    })
    article.save((err) => {
        if (err) {
            return res.send(err)
        }
        return res.send({success: 1})
    })
})

router.delete('/', function (req, res, next) {
    Article.remove({ _id: req.query._id }, (err, result) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send({success: 1})
        }
    })
})

router.put('/', function (req, res, next) {
    const form = new multiparty.Form();
    form.parse(req, (err, fileds, file) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        Article.update({ _id: fileds._id[0] }, { $set: { 
            tag: fileds.tag[0], 
            codeHtml: fileds.codeHtml[0], 
            title: fileds.title[0], 
            content: fileds.content[0], 
            updateTime: new Date().getTime(), 
            publish: fileds.publish[0], 
            canReply: fileds.canReply[0],
            cover: fileds.cover[0]
        }}, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            return res.send({success: 1});
        })
    })
})

router.get('/uploadimg/token', function(req, res, next) {
    new qiniuUpload().uploadToken('mainblog').then(token => {
        return res.send(token);
    })
})

module.exports = router;
