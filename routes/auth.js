var express = require('express');
var router = express.Router();
var MD5 = require('../public/javascripts/md5util').MD5;
MD5 = new MD5();
const User = require('../public/javascripts/mongo').User;
const JWT = require('../public/javascripts/jwt');

router.post('/login', function (req, res, next) {
  let user = req.body;
  User.findOne({userName: user.userName,password: MD5.MD5Value(user.password)}, function(err,result) {
    if (result) {
      const jwt = new JWT(result._id+','+result.userName);
      const _token = jwt.generateToken();
      res.cookie('_token', _token, {maxAge: 24*60*60 * 1000, httpOnly: true})
      return res.send({success: 1});
      return;
    }
    res.status(403).send({message:'用户名或密码错误'});
  })
})

router.post('/token', function(req, res, next) {
  if (req.cookies.username) {
    return res.send({success: 1});
  } else {
    res.status(401).send({ message: '请重新登录' });
  }
})

module.exports = router;
