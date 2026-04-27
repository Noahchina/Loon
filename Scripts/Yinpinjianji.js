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

var aFengYe = $response.body;
var obj =  JSON.parse(aFengYe);

obj.data.isR = obj.data.isSubscribe = true;
obj.data.timeExpire = "2999-01-01 00:00:00";

aFengYe = JSON.stringify(obj);
$done(aFengYe);