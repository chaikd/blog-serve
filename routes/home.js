var express = require('express');
const router = express.Router();
const Article = require('../public/javascripts/mongo').Article;
var Album = require('../public/javascripts/mongo').Album;

router.get('/',(req, res, next) => {
  let data = {}
  Promise.all([
    new Promise((resolve, reject) => {
      Album.find({type: 'FILE'}).limit(6).exec((err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    }),
    new Promise((resolve, reject) => {
      Article.find().limit(3).exec((err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    }),
  ]).then(([album, article]) => {
    data = {
      album,
      article
    }
    res.send(data)
  })
})

module.exports = router;
