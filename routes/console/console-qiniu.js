const Qiniu = require('../../public/javascripts/mongo').Qiniu;
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    Qiniu.findOne({}, (err, result) => {
        if(err) {
            return res.send(err)
        }
        return res.send(result)
    })
})

router.get('/canuse', (req, res) => {
    Qiniu.findOne({}, (err, result) => {
        if (err) {
            return res.send(false)
        }
        if (result) {
            let data = {
                accessKey: result.accessKey,
                secretKey: result.secretKey,
                albumUrl: result.albumUrl,
                blogUrl: result.blogUrl,
            }
            if (Object.values(data).some(v => !v)) {
                return res.send(false)
            }
        }
        return res.send(true)
    })
})


router.post('/', (req, res) => {
    let qiniu = new Qiniu({
        ...req.body,
        createTime: new Date().getTime(),
        updateTime: new Date().getTime()
    })

    qiniu.save((err, data) => {
        if (err) {
            return res.send(err)
        }
        return res.send({success: 1,data})
    })
})

router.put('/', (req, res) => {
    Qiniu.update({ _id: req.body._id }, {
        $set: req.body
    }, function (err, result) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        return res.send({ success: 1, data: result});
    })
})

module.exports = router;