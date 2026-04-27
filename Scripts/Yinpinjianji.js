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
