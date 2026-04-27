/******************************
脚本功能：音频剪辑-登陆后解锁会员
脚本作者：afengye
脚本频道：https://t.me/afengye
更新时间：2024-08-06
使用声明：️仅供学习交流, 🈲️商业用途
*******************************
[rewrite_local]
^https:\/\/pay\.camoryapps\.com\/appPay\/api\/user\/info\/tokenLogin url script-response-body https://raw.githubusercontent.com/afengye/QX/main/ypjj.js
^https:\/\/ad\.camoryapps\.com\/(\.?)+ url reject-200
[mitm] 
hostname = pay.camoryapps.com,ad.camoryapps.com
*******************************/

var body = $response.body;
var obj = JSON.parse(body);

// 兼容字段存在性
if (obj && obj.data) {
    obj.data.isR = true;
    obj.data.isSubscribe = true;
    obj.data.timeExpire = "2999-01-01 00:00:00";

    // 增强兼容（防止 App 多字段校验）
    obj.data.vip = true;
    obj.data.isVip = true;
    obj.data.vipType = 1;
}

// Loon 必须这样返回
$done({ body: JSON.stringify(obj) });

