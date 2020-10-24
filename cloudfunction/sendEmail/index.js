// 云函数入口文件
const cloud = require('wx-server-sdk');
//初始化云函数
cloud.init();
//引入发送邮件包
const nodemailer = require('nodemailer')
var config = {
  host: 'smtp.qq.com',//网易163邮箱 smtp.163.com
  port: 465,//网易邮箱端口
  auth: {
    user: '1772750193@qq.com',//邮箱账号
    pass: 'jnsjxytlsrsndbdf'//邮箱授权码
  }
};
//创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  //获取参数
  const {o_s_n,u_n,u_p,p_n,o_d,_p} = event;
  //创建一个邮件对象
  var mail = {
    //发件人
    from: 'INT打印 <1772750193@qq.com>',
    //主题
    subject: '您有新的订单',
    //收件人
    to: '1852982339@qq.com',
    //邮件内容
    text: '订单编号为：'+ o_s_n +'\n顾客姓名：' + u_n + '\n顾客手机：' + u_p + '\n打印数量：' + p_n
 + '\n下单时间：' + o_d + '\n订单总额：' + _p
  };
  let res = await transporter.sendMail(mail);
  return res;
}