var express = require('express');
var router = express.Router();
var Album = require('../public/javascripts/mongo').Album;
const qiniuUpload = require('../public/javascripts/qiniu');

/* client*/

router.get('/carousel', function(req, res) {
    Album.countDocuments({type: 'FILE'}, (err, count)=> {
        const skip = count>4 ? Math.floor(Math.random()*count+4)-4 : 0;
        const limit = count > 4 ? 4 : count;
        Album.find({type: 'FILE'}).skip(skip).limit(limit).exec((err, data) => {
            if(err){
                return res.send(err);
            }
            return res.send(data);
        })
    })
})

router.get('/:id', function(req, res) {
    Album.find({'parentId': req.params.id, 'publish': 1},async (err, doc) => {
        if(err) {
            return res.send(err)
        }
        let theDoc = [];
        await Promise.all(doc.map(async (v,k) => {
            theDoc.push({...v._doc});
            if(v.childCount > 0) {
                await Album.find({'parentId': v._id}, (err, docs) => {
                    if(err) {
                        return res.send(err)
                    }
                    theDoc[k].childrenList = docs;
                })
            }
        }))
        return res.send(theDoc)
    })
})

module.exports = router;
