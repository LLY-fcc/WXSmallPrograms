// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//引入发送短信的SDK
const tencentcloud = require("./node_modules/tencentcloud-sdk-nodejs");
//发送短信必要模块
const Credential = tencentcloud.common.Credential;
const secretId = "***"
const secretKey = "***"
  //传入id\key
let cred = new Credential(secretId, secretKey);
// 导入 SMS 模块的 client models
const models = tencentcloud.sms.v20190711.Models;
let req = new models.SendSmsRequest();
req.SmsSdkAppid = "1400431854";
req.Sign = "布灵布灵哒";
req.PhoneNumberSet = [];
  //模板ID
//req.TemplateID = "744615";
  //设置地域信息
const smsClient = tencentcloud.sms.v20190711.Client;
let client = new smsClient(cred, "ap-beijing");


// 云函数入口函数
exports.main = async (event, context) => {
  const {phone,para_1,para_2,tId} = event;
  const _phone = '+86' + phone;
  req.TemplateID = tId;
  req.PhoneNumberSet = [_phone];
  req.TemplateParamSet = [para_1,para_2];
  //初始化一个标志
  var tar = 1
  client.SendSms(req, function (err, response) {
    // 请求异常返回，打印异常信息
    if (err) {
      tar = 0;
      console.log(err)
    }
  });
  return {
    tar: tar
  }
}
