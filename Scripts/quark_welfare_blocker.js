/**
 * 夸克 iOS：屏蔽「福利中心」首页入口
 *
 * 针对抓包中确认的：
 *   https://hp-cms.quark.cn/open-cms
 *
 * 只删除 CMS 配置中每个 item 的 welfare* 字段，
 * 不拦截 quark.cn，也不影响搜索、网盘等正常请求。
 */

(function () {
  const body = $response && $response.body;

  if (!body) {
    $done({});
    return;
  }

  try {
    const obj = JSON.parse(body);

    // 只处理抓包确认的配置节点，避免误伤其他 CMS 数据。
    const config = obj && obj.cms_user_center_welfare_farm_new_config;

    if (
      config &&
      config.res_data &&
      Array.isArray(config.res_data.data)
    ) {
      for (const group of config.res_data.data) {
        if (!group || !Array.isArray(group.items)) continue;

        for (const item of group.items) {
          if (!item || typeof item !== "object") continue;

          // welfareTitle / welfareUrl / welfare_play_* / welfareSeries
          // 都是抓包中确认的「福利中心」字段。
          for (const key of Object.keys(item)) {
            if (/^welfare/i.test(key)) {
              delete item[key];
            }
          }
        }
      }
    }

    $done({
      body: JSON.stringify(obj)
    });
  } catch (e) {
    // 如果夸克以后改变响应格式，则不修改原响应，避免影响夸克正常功能。
    $done({});
  }
})();
