var express = require('express');
var router = express.Router();
var MD5 = require('../../public/javascripts/md5util').MD5;
MD5 = new MD5();
const User = require('../../public/javascripts/mongo').User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  const pagination = req.query;
  const tag = pagination.selectedTag ? { tag: pagination.selectedTag } : {};
  User.find(tag).skip((Number(pagination.currentPage)-1) * Number(pagination.size)).limit(Number(pagination.size)).exec(function (err, data) {
    if (err) {
        return res.send(err)
    }
    User.countDocuments(tag, function (err, result) {
        data = data.map(v => {
            return {
                _id: v._id,
                userName: v.userName,
                power: v.power
            };
        })
        return res.send({content: data, total: result, currentPage: Number(pagination.currentPage), size: Number(pagination.size)})
    })
  })
});

router.get('/isexist',(req, res, next) => {
  User.findOne({ 'userName': req.query.userName }, (err, result) => {
    if (result) {
      res.status(400).send('用户名已存在');
      return
    } else {
      res.status(200).send()
    }
  })
})

router.post('/', function (req, res, next) {
  let user = new User({
      ...req.body,
      password: MD5.MD5Value(req.body.password)
  })
  user.save((err) => {
    if (err) {
        return res.send(err)
    }
    return res.send({success: 1})
  })
})

router.delete('/', function (req, res, next) {
  User.remove({ _id: req.query._id }, (err, result) => {
      if (err) {
          return res.send(err)
      } else {
          return res.send({success: 1})
      }
  })
})

module.exports = router;
