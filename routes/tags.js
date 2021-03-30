var express = require('express');
var router = express.Router();
const Tag = require('../public/javascripts/mongo').Tag;

router.get('/', (req, res, next) => {
    Tag.find({}, function (err, data) {
        if (err) {
            return res.send(err);
        }
        return res.send(data)
    })
})
module.exports = router; 