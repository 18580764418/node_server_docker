var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    openid: String,
    mobilePhone: String,
    nickName: String,
    authorUrl: String,
    password: String,
    email: String,
    createTime: {
        type: Date,
        default: Date.now
    }
});

exports.User = mongoose.model('User', userSchema);
