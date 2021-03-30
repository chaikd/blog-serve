var crypto = require('crypto')

exports.MD5 = class MD5 {
    MD5Value(value) {
        return crypto.createHash('md5').update(value).digest('hex')
    }
}

