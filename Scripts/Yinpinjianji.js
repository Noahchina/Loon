/******************************
脚本功能：音频剪辑-登陆后解锁会员
脚本作者：afengye
脚本频道：https://t.me/afengye
更新时间：2024-08-06
使用声明：️基于原作者修改使可用于Loon
*******************************
[Rewrite]
^https:\/\/ad\.camoryapps\.com\/(\.?)+ - reject-200

[Script]
http-response ^https:\/\/pay\.camoryapps\.com\/.* script-path= https://raw.githubusercontent.com/Noahchina/Loon/main/Scripts/Yinpinjianji.js, requires-body=true, timeout=60, tag=Yinpinjianji


[MITM]
hostname = pay.camoryapps.com, ad.camoryapps.com
*******************************/

var body = $response.body;
var obj = JSON.parse(body);

// 强制会员
if (obj.data) {
    obj.data.isR = true;
    obj.data.isSubscribe = true;
    obj.data.timeExpire = "2999-01-01 00:00:00";

    obj.data.vip = true;
    obj.data.isVip = true;
    obj.data.vipType = 1;
}

$done({ body: JSON.stringify(obj) });