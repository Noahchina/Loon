/**
 * 夸克 iOS - 去除首页「福利中心」
 *
 * Target:
 * https://hp-cms.quark.cn/open-cms
 *
 * 说明：
 * 1. 不 REJECT hp-cms.quark.cn
 * 2. 递归扫描整个 JSON
 * 3. 删除 welfare 开头的配置字段
 * 4. 支持嵌套 JSON 字符串
 */

(function () {
  const body = $response && $response.body;

  if (!body) {
    $done({});
    return;
  }

  let changed = 0;

  // 处理 JSON 字符串
  function cleanJsonString(str) {
    const s = str.trim();

    if (
      !(s.startsWith("{") && s.endsWith("}")) &&
      !(s.startsWith("[") && s.endsWith("]"))
    ) {
      return str;
    }

    try {
      const nested = JSON.parse(s);
      const before = JSON.stringify(nested);

      clean(nested);

      const after = JSON.stringify(nested);

      return before === after ? str : after;
    } catch (e) {
      return str;
    }
  }

  // 递归处理整个 JSON
  function clean(value) {
    if (Array.isArray(value)) {
      for (let i = value.length - 1; i >= 0; i--) {
        const item = value[i];

        if (typeof item === "string") {
          const cleaned = cleanJsonString(item);

          if (cleaned !== item) {
            value[i] = cleaned;
            changed++;
          }
        } else {
          clean(item);
        }
      }

      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    for (const key of Object.keys(value)) {
      const lower = key.toLowerCase();

      // 删除福利中心相关字段
      if (lower.indexOf("welfare") === 0) {
        delete value[key];
        changed++;
        continue;
      }

      const child = value[key];

      // 有些 CMS 会把 JSON 放在字符串里面
      if (typeof child === "string") {
        const cleaned = cleanJsonString(child);

        if (cleaned !== child) {
          value[key] = cleaned;
          changed++;
        }
      } else {
        clean(child);
      }
    }
  }

  try {
    const obj = JSON.parse(body);

    clean(obj);

    if (
      typeof $notification !== "undefined" &&
      changed > 0
    ) {
      $notification(
        "夸克去福利中心",
        "已处理福利中心",
        "删除字段数：" + changed
      );
    }

    $done({
      body: JSON.stringify(obj)
    });

  } catch (e) {

    // 如果返回格式不是 JSON，
    // 不修改响应，避免影响夸克正常功能。

    $done({});
  }

})();
