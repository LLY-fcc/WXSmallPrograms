// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {_openid,_tId,_data} = event;
  console.log(_openid,_tId,_data)
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: _openid,
        templateId: _tId,
        page: 'pages/userorder/userorder',
        data: _data
      });
    return result
  } catch (err) {
    return err
  };
}