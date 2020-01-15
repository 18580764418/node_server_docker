var express=require('express');
var request = require('request');
var router=express.Router();
const crypto=require('crypto');
var User = require('../schema/models').User;
var Post = require('../schema/models').Post;
var Comment = require('../schema/models').Comment;
var Project = require('../schema/models').Project;
var ApplyConfig = require('../schema/models').ApplyConfig
var Applicant = require('../schema/models').Applicant

router.get('/user/login',function(req,res,next){
    const params = req.query.v?req.query:req.body
    var openid=params.openid;
    var mobilePhone=params.mobilePhone;
    var password=params.password;
    var ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || ''
    var lastLoginIp = ip
    let responseData={};
    let query = {};
    //基本验证
    if(openid==''||typeof openid=="undefined"){
        if(mobilePhone==''||typeof mobilePhone=="undefined"){
            responseData.code=1;
            responseData.message='手机号不能为空！';
            res.json(responseData);
            return;
        }
    
        if(password==''||typeof password=="undefined"){
            responseData.code=2;
            responseData.message='密码不得为空！';
            res.json(responseData);
            return;
        }
        query = {
            $or:[
                {mobilePhone:mobilePhone},
                {password:password},
            ]
        }
    }else{
        query = {
            openid:openid,
        } 
    }

    User.findOneAndUpdate(query,{
        lastLoginIp:lastLoginIp
    }).then(function(userInfo){
        let uid=userInfo.openid + userInfo.mobilePhone + userInfo.password
        let skey=userInfo._id + userInfo.nickName

        uid=crypto.createHash('SHA256').update(uid).digest('hex');
        skey=crypto.createHash('SHA256').update(skey).digest('hex');
        let timekey=crypto.createHash('SHA256').update(Date.now().toString()).digest('hex');
        skey = "favs" + skey.slice(60) + timekey.slice(8);
        req.session.uid = uid;
        req.session.skey = skey;

        res.cookie('uid',uid);
        res.cookie('skey',skey);

        res.json(userInfo);
    }).catch(function(reason) {
        responseData.code=3;
        responseData.message=reason;
        res.json(responseData);
    });
});

router.post('/user/update',function(req,res,next){
    const params = req.query.v?req.query:req.body
    var mobilePhone=req.body.mobilePhone;
    var password=req.body.password;
    var nickName=req.body.nickName;
    var authorUrl=req.body.authorUrl;
    var email=req.body.email;
    var responseData={};

    if(mobilePhone==''||typeof mobilePhone=="undefined"){
        responseData.code=1;
        responseData.message='手机不能为空！';
        res.json(responseData);
        return;
    }
    if(typeof password=="undefined"){
        responseData.code=2;
        responseData.message='密码不得为空！';
        res.json(responseData);
        return;
    }
    
    User.findOne({
        mobilePhone:mobilePhone
    }).then(function(userInfo){
        if(userInfo){
            if(userInfo.password!==password){
                responseData.code=2;
                responseData.message='密码不一致';
                res.json(responseData);
                throw '密码不一致';
            }else{
                User.update(
                    { _id: id }, 
                    { $set: { 
                        nickName: nickName,
                        authorUrl: authorUrl,
                        email: email,
                    }}, function (err, info) {
                    if (err) return handleError(err);
                    console.log(info);
                    responseData.code=0;
                    responseData.message='修改成功';
                    res.json(responseData);
                    return responseData;
                  });
            }
        }else{
            responseData.message='用户不存在';
            responseData.code=1;
            res.json(responseData);
            throw '用户不存在';
        }
    }).catch(function(reason) {
        console.log(reason);
    });
});

router.post('/user/register',function(req,res,next){
    const params = req.query.v?req.query:req.body
    var mobilePhone=req.body.mobilePhone;
    var password=req.body.password;
    var repassword=req.body.repassword;
    var responseData={};
    var ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || ''
    params.registeredIp = ip
    params.lastLoginIp = ip
 
    //基本验证
    if(mobilePhone==''||typeof mobilePhone=="undefined"){
        responseData.code=1;
        responseData.message='用户名不得为空！';
        res.json(responseData);
        return;
    }

    if(password==''||typeof password=="undefined"){
        responseData.code=2;
        responseData.message='密码不得为空！';
        res.json(responseData);
        return;
    }

    if(repassword!==password){
        responseData.code=3;
        responseData.message='两次密码不一致！';
        res.json(responseData);
        return;
    }
    
    // 用户名是否被注册？
    User.findOne({
        mobilePhone:mobilePhone
    }).then(function(userInfo){
        if(userInfo){
            responseData.code=4;
            responseData.message='该用户名已被注册！';
            res.json(responseData);
            throw '该用户名已被注册！';
        }else{//保存用户名信息到数据库中
            var user=new User(params);
            return user.save();
        }
    }).then(function(newUserInfo){
        responseData.message='注册成功！';
        responseData.nickName = newUserInfo.nickName;
        res.json(responseData);
    },function(reason) {
        console.log(reason);
    });
});

router.post('/wx_user/register',function(req,res,next){
    const params = req.query.v?req.query:req.body
    var openid=req.body.openid;
    var mobilePhone=req.body.mobilePhone;
    var nickName=req.body.nickName;
    var authorUrl=req.body.authorUrl;
    var password=req.body.password;
    var responseData={};
    var openidstr_6='owe6A4';

    //基本验证
    if(authorUrl==''||typeof authorUrl=="undefined"){
        responseData.code=3;
        responseData.message='authorUrl不能为空！';
        res.json(responseData);
        return;
    }else{
        request(authorUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // 请求成功的处理逻辑
            }else{
                responseData.code=4;
                responseData.message='authorUrl不存在！';
                res.json(responseData);
                return;
            }
        });
    }
    
    if(openid==''||typeof openid=="undefined"||openid.length!=28||openid.indexOf(openidstr_6)!=0){
        responseData.code=1;
        responseData.message='openid不存在！';
        res.json(responseData);
        return;
    }

    if(nickName==''||typeof nickName=="undefined"){
        responseData.code=2;
        responseData.message='nickName不能为空！';
        res.json(responseData);
        return;
    }

    var user=new User({
        openid: openid,
        mobilePhone: mobilePhone?mobilePhone:undefined,
        nickName: nickName,
        authorUrl: authorUrl,
        password: password,
        email: req.body.email,
    });
    responseData.code=0;
    responseData.message='注册成功！';
    res.json(responseData);
    return user.save();
});

router.post('/submit/comment', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.body);
    var doc = new Comment(req.body);
    var ret = doc.save();
    console.log(ret);
    return ret;
});

router.post('/post', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.body);
    var doc = new Post(req.body);
    return doc.save();
});

router.get('/post_list', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.query);
    Post.findById(req.query.id, function (err, post) {
        console.log(post);
    });
});

router.post('/project', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.body);
});

router.get('/project_list', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.query);
    Project.findById(req.query.id, function (err, project) {
        console.log(project);
    });
});

router.post('/set/apply_config', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.body);
});

router.get('/apply_config', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.query);
    ApplyConfig.findById(req.query.id, function (err, applyConfig) {
        console.log(applyConfig);
    });
});

router.post('/apply/applicant', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(req.body);
});

router.get('/applicant', function(req,res,next){
    const params = req.query.v?req.query:req.body
    console.log(params)
    let responseData={};
    // Applicant.findById(req.query.id, function (err, applicant) {
    //     console.log(applicant);
    // });
    responseData.code=0;
    responseData.message=req.cookies.skey;
    res.json(responseData);
});

module.exports=router;
