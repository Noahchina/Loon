/**
 * 夸克 iOS - 屏蔽首页「福利中心」
 * V3
 *
 * 目标：
 * https://hp-cms.quark.cn/open-cms
 *
 * 原理：
 * 精确修改：
 * cms_user_center_welfare_farm_new_config
 *
 * 将：
 * res_data.data
 *
 * 清空，使首页不再获得福利/农场运营卡片配置。
 */

(function () {
    const body = $response && $response.body;

    if (!body) {
        $done({});
        return;
    }

    try {
        const obj = JSON.parse(body);

        const config =
            obj &&
            obj.result &&
            obj.result.cms_user_center_welfare_farm_new_config;

        if (
            config &&
            config.res_data &&
            Array.isArray(config.res_data.data)
        ) {

            // 记录原来的数量
            const oldCount = config.res_data.data.length;

            // 清空福利/农场运营组件配置
            config.res_data.data = [];

            if (typeof $notification !== "undefined") {
                $notification(
                    "夸克去福利中心",
                    "拦截成功",
                    "已清除 " + oldCount + " 组福利中心配置"
                );
            }

            $done({
                body: JSON.stringify(obj)
            });

            return;
        }

        // 没找到目标配置
        if (typeof $notification !== "undefined") {
            $notification(
                "夸克去福利中心",
                "未找到目标配置",
                "CMS 结构可能发生变化"
            );
        }

        $done({});

    } catch (e) {

        if (typeof $notification !== "undefined") {
            $notification(
                "夸克去福利中心",
                "处理失败",
                String(e)
            );
        }

        // 出错时不修改原始响应
        $done({});
    }

})();
