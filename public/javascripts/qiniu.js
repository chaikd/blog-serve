const qiniu = require('qiniu');
const Qiniu = require('./mongo').Qiniu;

module.exports = class qiniuUploadToken {
    
    constructor(){}

    getQiniuInfo() {
        return new Promise((resolve, reject) => {
            Qiniu.find({}, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result)
            })
        })
    }
    
    uploadToken(scope) {
        return new Promise((reslove, reject) => {
            this.getQiniuInfo().then(res => {
                const accessKey = res.accessKey;
                const secretKey = res.secretKey;
                const albumReturnBody = '{"name": "$(key)","imgUrl":"'+ res.albumUrl +'/$(key)"}';
                const articleReturnBody = '{"key":"$(key)","name": "$(key)", "hash":"$(etag)","imgUrl":"' + res.blogUrl+'/$(key)"}';
                const returnBody = scope == 'mainalbum' ? albumReturnBody : articleReturnBody;
                const options = {
                    scope: scope,
                    expires: 3600,
                    returnBody: returnBody
                }
                const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
                const putPolicy = new qiniu.rs.PutPolicy(options);
                const uploadToken = putPolicy.uploadToken(mac);
                reslove(uploadToken);
            }, err => {
                reject('未设置')
            })
        })
    }
    
}