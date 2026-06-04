let obj = JSON.parse($response.body);

if (obj?.data?.connectorList) {
    let body = $request.body || "";
    if (body.includes("YT_SPLASH") || body.includes("YT_LAUNCH_POPUP")) {
        obj.data.connectorList = [];
    }
}

$done({body: JSON.stringify(obj)});