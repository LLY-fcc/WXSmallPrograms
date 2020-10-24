// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'int-print-env-3jd7g'})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {_indexValue,_updateValue_1,_updateValue_2} = event;
  console.log(_indexValue,_updateValue_1,_updateValue_2)
  try {
    return await db.collection('orderforms').where({
      _id: _indexValue
    }).update({
      data: {
        order_status_tag: _updateValue_1,
        order_status: _updateValue_2
      }
    });
  } catch(err) {
    return err
  }
}