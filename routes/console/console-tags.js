var express = require('express');
var router = express.Router();
const Tag = require('../../public/javascripts/mongo').Tag;

router.get('/', (req, res, next) => {
    Tag.find({}, function (err, data) {
        if (err) {
            return res.send(err);
        }
        return res.send(data)
    })
})
router.post('/', (req, res, next) => {
    const tag = new Tag({ ...req.body });
    Tag.findOne({ 'name': tag.name }, (err, result) => {
        if (result) {
            res.status(400).send('标签已存在')
        } else {
            tag.save((error) => {
                if (error) {
                    res.status(500).send(error);
                    return;
                }
                return res.send({success: 1})
            })
        }
    })
})
router.delete('/', (req, res, next) => {
    Tag.remove({ _id: req.query._id }, (err, result) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send({success: 1})
        }
    })
})
module.exports = router; 