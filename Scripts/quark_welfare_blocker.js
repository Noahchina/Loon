/**
 * 夸克 iOS - 去除「福利中心」
 * V4
 *
 * 1. 修改 hp-cms 首页 CMS 配置
 * 2. 删除 welfare 相关字段
 * 3. 删除福利中心相关配置
 */

(function () {

    const body = $response && $response.body;

    if (!body) {
        $done({});
        return;
    }

    try {

        const obj = JSON.parse(body);

        let changed = 0;

        function clean(value) {

            if (!value || typeof value !== "object") {
                return;
            }

            if (Array.isArray(value)) {

                for (let i = value.length - 1; i >= 0; i--) {

                    const item = value[i];

                    if (
                        item &&
                        typeof item === "object"
                    ) {
                        clean(item);
                    }
                }

                return;
            }

            for (const key of Object.keys(value)) {

                const lower = key.toLowerCase();

                /*
                 * welfare 开头字段全部删除
                 */
                if (lower.startsWith("welfare")) {

                    delete value[key];

                    changed++;

                    continue;
                }

                /*
                 * 找到福利中心 CMS 配置
                 */
                if (
                    key === "cms_user_center_welfare_farm_new_config"
                ) {

                    const config = value[key];

                    if (
                        config &&
                        config.res_data &&
                        Array.isArray(config.res_data.data)
                    ) {

                        /*
                         * 只保留非福利内容
                         *
                         * 由于这个 CMS 配置本身就是
                         * welfare/farm 卡片配置，
                         * 清空 data 最可靠。
                         */

                        config.res_data.data = [];

                        changed++;

                    }

                    continue;
                }

                clean(value[key]);
            }
        }

        clean(obj);

        if (changed > 0) {

            $notification(
                "夸克去福利中心",
                "处理成功",
                "修改项目：" + changed
            );

        }

        $done({
            body: JSON.stringify(obj)
        });

    } catch (e) {

        $notification(
            "夸克去福利中心",
            "脚本错误",
            String(e)
        );

        $done({});
    }

})();
