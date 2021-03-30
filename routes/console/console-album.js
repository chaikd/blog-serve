var express = require('express');
var router = express.Router();
var Album = require('../../public/javascripts/mongo').Album;
const qiniuUpload = require('../../public/javascripts/qiniu');

/* console*/
router.get('/token', function(req, res, next) {
    new qiniuUpload().uploadToken('mainalbum').then(token => {
        return res.send(token);
    })
});

router.get('/:id', function(req, res) {
    Album.find({'parentId': req.params.id},(err, doc) => {
        if(err) {
            return res.send(err)
        }
        return res.send(doc)
    })
})

router.post('/', function(req, res, next) {
    let operation, album, albumFiles;
    if(req.body.type=='FOLDER') {
        album = new Album({
            ...req.body,
            createdTime: new Date().getTime(),
            childCount: 0,
            children: undefined,
            parentId: req.body.parentId || 0
        });
        operation = {$push: {'children': album}};
    } else {
        albumFiles = req.body.fileList.map(v => {
            if (req.body.parentId) {
                // Album.findOneAndUpdate({'_id': req.body.parentId}, {defaultImg: v.imgUrl}, {new: true}, (err, doc) => {
                Album.findOneAndUpdate({'_id': req.body.parentId}, (err, doc) => {
                    if(err) {
                        return res.send(err)
                    }
                })
            }
            return {
                name: v.name,
                type: req.body.type,
                publish: req.body.publish,
                imgUrl: v.imgUrl,
                createdTime: new Date().getTime(),
                parentId: req.body.parentId || 0,
                children: undefined,
                childCount: undefined,
                description: req.body.description
            }
        });
        operation = {$push: {'children': {$each: albumFiles}}};
    }
    if(req.body.parentId != 0) {
        if(req.body.type=='FOLDER') {
            album.save((err, product)=> {
                if(err) {
                    return res.send(err)
                }
                // Album.findOneAndUpdate({'_id': req.body.parentId}, {$push: {'children': product._id}, $inc:{'childCount': 1}}, {new: true}, (err, doc) => {
                Album.findOneAndUpdate({'_id': req.body.parentId}, {$inc:{'childCount': 1}}, {new: true}, (err, doc) => {
                    if(err) {
                        return res.send(err)
                    }
                    return res.send(doc);
                })
            })
        } else {
            Album.insertMany(albumFiles, (err, doc) => {
                if(err) {
                    return res.send(err)
                }
                const childrenDoc = [];
                doc.forEach(v => {
                    childrenDoc.push(v._id);
                })
                // Album.findOneAndUpdate({'_id': req.body.parentId}, {$push: {'children': {$each: childrenDoc}}, $inc:{'childCount': childrenDoc.length}, 'defaultImg': doc[doc.length-1].imgUrl}, (err, product) => {
                Album.findOneAndUpdate({'_id': req.body.parentId}, {$inc:{'childCount': childrenDoc.length}}, (err, product) => {
                    if(err) {
                        return res.send(err)
                    }
                    return res.send(doc);
                })
            })
        }
    }else {
        if(req.body.type=='FOLDER') {
            album.save((err, product)=> {
                if(err) {
                    return res.send(err)
                }
                return res.send(product);
            })
        }else {
            Album.insertMany(albumFiles, (err, doc) => {
                if(err) {
                    return res.send(err)
                }
                return res.send(doc);
            })
        }
    }
})

router.delete('/:id', function(req, res) {
    // Album.findOneAndUpdate({'_id': req.query.parentId}, {$pull: {'children': req.params.id}, $inc:{'childCount': -1}}, {new: true}, (err, doc) => {
    Album.findOneAndUpdate({'_id': req.query.parentId}, {$inc:{'childCount': -1}}, {new: true}, (err, doc) => {
        if(err) {
            return res.send(err)
        }
        Album.deleteOne({'_id': req.params.id},(error, result) => {
            if(err) {
                return res.send(error)
            }
            return res.send(result)
        })
    })
})

router.put('/', function(req, res) {
    Album.findOneAndUpdate({'_id': req.body._id},{...req.body},{new: true},(err, result) => {
        if(err) {
            return res.send(err)
        }
        return res.send(result)
    })
})

module.exports = router;
