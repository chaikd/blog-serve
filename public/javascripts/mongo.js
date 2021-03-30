var mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost:27017/blogdb';
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);

// article
const articleSchema = new Schema({
    content: String,
    codeHtml: String,
    title: String,
    description: String,
    tag: String,
    cover: String,
    createTime: { type: Number, default: new Date().getTime() },
    updateTime: { type: Number, default: new Date().getTime() },
    commentCount: Number,
    canReply: { type: Number, default: 1 },
    publish: { type: Number, default: 1 },
    defaultImg: String
})
    
const Article = mongoose.model('article', articleSchema);

// tag
const tagSchema = new Schema({
    name: String,
})
    
const Tag = mongoose.model('tag', tagSchema);

// user
const userSchema = new Schema({
    userName: String,
    password: String,
    power: String // 'A':管理权限，'B':评论权限(未开发)，'C':仅浏览权限(未开发)
})
    
const User = mongoose.model('user', userSchema);

// reply
const replySchema = new Schema({
    content: String,
    createdBy: Object,
    commentId: String,
    createdTime: { type: Number, default: new Date().getTime() },
    repliedUser: Object,
    targetReplyId: String,
    publish: { type: Boolean, default: true}
})
    
const Reply = mongoose.model('reply', replySchema);

// comment
const commentSchema = new Schema({
    content: String,
    createdBy: Object,
    createdTime: { type: Number, default: new Date().getTime() },
    targetId: String,
    replicesCount: { type: Number, default: 0},
    publish: { type: Boolean, default: true}
})
    
const Comment = mongoose.model('comment', commentSchema);

// album
const albumSchema = new Schema({
    name: String,
    type: String, // FOLDER FILE
    publish: { type: Number, default: 1 },
    childCount: { type: Number, default: 0},
    children: Array,
    createdTime: { type: Number, default: new Date().getTime() },
    parentId: { type: String, default: '0'},
    imgUrl: String,
    // defaultImg: String
})
    
const Album = mongoose.model('album', albumSchema);

// qiniu
const qiniuSchema = new Schema({
    accessKey: String,
    secretKey: String,
    albumUrl: String,
    blogUrl: String
})

const Qiniu = mongoose.model('qiniu', qiniuSchema);
    
/**
 * 连接
 */
mongoose.connect(DB_URL, { useNewUrlParser: true,  useUnifiedTopology: true }).then(value => {
    console.log('cliented  mongodb')
});

module.exports =  {
    Article,
    Tag,
    User,
    Reply,
    Comment,
    Album,
    Qiniu
}
