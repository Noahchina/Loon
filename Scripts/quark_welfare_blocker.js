/**
 * 夸克 iOS - 去除首页「福利中心」
 * V4
 */

(function () {

    const body = $response && $response.body;

    if (!body) {
        $done({});
        return;
    }

    try {

        const obj = JSON.parse(body);

        /*
         * 真实结构：
         *
         * obj
         * └── result
         *     └── cms_user_center_welfare_farm_new_config
         */

        const config =
            obj &&
            obj.result &&
            obj.result.cms_user_center_welfare_farm_new_config;

        if (
            config &&
            config.res_data &&
            Array.isArray(config.res_data.data)
        ) {

            let changed = 0;

            /*
             * 福利中心和教育认证、农场等共用同一个 CMS item。
             *
             * 不删除整个 item，
             * 只删除 welfare 相关字段。
             */

            for (const group of config.res_data.data) {

                if (!group || !Array.isArray(group.items)) {
                    continue;
                }

                for (const item of group.items) {

                    if (!item || typeof item !== "object") {
                        continue;
                    }

                    for (const key of Object.keys(item)) {

                        if (/^welfare/i.test(key)) {

                            delete item[key];

                            changed++;
                        }
                    }
                }
            }

            $notification(
                "夸克去福利中心",
                "脚本已匹配",
                "删除 welfare 字段：" + changed
            );

            $done({
                body: JSON.stringify(obj)
            });

            return;
        }

        $notification(
            "夸克去福利中心",
            "没有匹配到 CMS 配置",
            "请检查 open-cms 响应"
        );

        $done({});

    } catch (e) {

        $notification(
            "夸克去福利中心",
            "脚本错误",
            String(e)
        );

        $done({});
    }

})();
