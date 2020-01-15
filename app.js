var express=require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
let http = require("http");
let https = require("https");
let fs = require("fs");
var path = require('path')
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var os=require('os');
var app=express();
var checkLogin = require('./checkLogin.js');

//mongodb地址ip
var mongodb_ip=os.networkInterfaces().eth0?'mongo_db':'127.0.0.1';

// Configuare https
const httpsOption = {
    key : fs.readFileSync("./public/private.key"),
    cert: fs.readFileSync("./public/full_chain.pem")
}
app.use(session({
    secret: 'keyboard cat', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {maxAge: 60*60*1000}
}));
app.use(cookieParser());
// 解析 urlencoded 请求体必备
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/api',checkLogin.noLogin,require('./routers/api'));

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://'+mongodb_ip+':27017/favs',{ useNewUrlParser: true },function(err){
    if(err){
        console.log('数据库连接失败！');
    }else{
        console.log('mongodb connect success!');
        http.createServer(app).listen(8888);
        https.createServer(httpsOption, app).listen(8443);
    }
})
