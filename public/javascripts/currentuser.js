const JWT = require('./jwt');
const User = require('../javascripts/mongo').User;

function tokenInfo (cookies) {
    return new Promise(resolve => {
        const _token = cookies._token;
        const jwt = new JWT(_token);
        const tokenInfo = jwt.verifyToken();
        resolve(tokenInfo);
    })
}

function currentUser (cookies) {
    return new Promise((resolve => {
        tokenInfo(cookies).then(tokenInfo => {
            const userId = tokenInfo && tokenInfo.split(',')[0];
            const userName = tokenInfo && tokenInfo.split(',')[1];
            User.find({ '_id': userId }, (err, result) => {
                if (result) {
                    resolve(result)
                }
            })
        })
    }))
}

module.exports = currentUser