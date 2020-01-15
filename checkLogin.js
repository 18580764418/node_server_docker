const crypto=require('crypto');
// 已登录
function login(req, res, next){
    if(req.session.uid){
        console.log('你已经登录');
        return res.redirect('back'); //返回之前的页面
    }
    next();
}

// 未登录
function noLogin(req, res, next){
    console.log(req.session.skey)
    console.log(req.cookies.skey)
    if(req.url.indexOf("login")>-1 || req.url.indexOf("register")>-1){
        if(req.session.uid&&req.session.uid==req.cookies.uid && req.session.skey==req.cookies.skey){
            console.log('你已经登录');
            return res.redirect('back'); //返回之前的页面
        }
    }else{
        if(req.session.uid&&req.session.uid==req.cookies.uid && req.session.skey==req.cookies.skey){
            let timekey=crypto.createHash('SHA256').update(Date.now().toString()).digest('hex');
            let skey= req.session.skey.slice(0,8)+timekey.slice(8);
            req.session.skey = skey;
            res.cookie('skey',skey);
        }else{
            res.json({code:5,message:'未登录状态'});
            return;
        }
    }
    next();
}

exports.login = login;
exports.noLogin = noLogin;