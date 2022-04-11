/**
 * 用户设置
 *  增加
 *  修改
 */
const express = require("express");
const resData = require("./resData");
const svg = require("./api/captureCode");
const {
    user
} = require("../dataBase/index");
const {
    createToken,
    decodeToken
} = require("./api/jwt");
const userRouter = express.Router();
// 添加用户
userRouter.post("/", async (req, res) => {
    const token = createToken({
        loginId: req.body.loginId,
        loginPwd: req.body.loginPwd
    }, req.body.maxAge * 24 * 3600 || 24 * 3600); //7天免登陆或者1天免登陆
    console.log(req.body, "body is what");
    try {
        await user.create({
            name: req.body.loginId,
            password: req.body.loginPwd,
            avatar: req.body.avatar,
            uuid: token
        })
    } catch (err) {
        res.status(500).send("用户名重复");
        return;
    }
    res.header("authorization", token);
    res.cookie("login", token);
    resData.data = "success";
    res.send(resData);
});

//用户登录
userRouter.post("/login", (req, res) => {
    console.log(req.body.capture,"验证码为" ,svg.getText(), svg.getText() !== req.body.capture);
    if(svg.getText() !== req.body.capture){
        return res.send("验证码错误");
    }
    //用户信息
    const userData = {
        name: req.body.loginId,
        password: req.body.loginPwd
    };

    //判断用户是否存在
    const result = user.findOne({
        where: {
            name: userData.name
        }
    });
    if(!result) return res.status(500).send("用户不存在, 亲登录");

    //创建token
    const token = createToken(userData, req.body.maxAge * 24 * 3600 || 24 * 3600); //7天免登陆或者1天免登陆
    res.header("authorization", token);
    res.cookie("login", token);
    resData.code = "200";
    resData.data = token;
    res.send(resData);
})

//用户免登陆
userRouter.get("/whoami", (req, res)=>{
    const result = decodeToken(req.headers.authorization);
    resData.data = req.headers.authorization;
    res.send(resData);
})

module.exports = userRouter;