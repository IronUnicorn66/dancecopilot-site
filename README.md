# dancecopilot.cn

扒舞搭子 / DanceCopilot 的公开静态站，由 GitHub Pages 托管。

- 营销：https://dancecopilot.cn/
- 支持：https://dancecopilot.cn/support
- 隐私：https://dancecopilot.cn/privacy

联系邮箱统一为 `ironunicorn@163.com`。

视觉以本仓库为准。应用仓库 `docs/legal/privacy.html` 只同步隐私正文；不要用那份单文件源稿覆盖本站的页头、页脚和共用样式。

## 点数版本与链接

`codex/ios-credits-referrals` 增加邀请页 `/invite/?code=…`、活动页 `/rewards/?campaign=…` 及中英文说明。网页仅展示代码和打开 App 的入口，不自动领取、不读取剪贴板。无效代码不能打开 App。

`.well-known/apple-app-site-association` 与 `.nojekyll` 用于 Universal Links。发布后必须核对根域名和 `www` 的 AASA 直接返回 200、JSON 和 `application/json` 响应头，无重定向；静态托管/CDN 的实际响应未验证前不能声称域名关联可用。关联 App ID 为 `772S256YAH.cn.dancecopilot.app`，签名和 entitlement 需匹配。

隐私页面更新日期为 2026-11-10；首页、支持、邀请和活动页区分 TestFlight 与正式版余额。iPhone 联网打开邀请链接后，已登录账号自动领取；未登录时完成 Apple 登录后继续领取。安装后需重新打开原链接。首次启动赠送 3 点，邀请奖励双方各 2 点，每个账号限领一次，邀请人每个月最多获得 10 点。点数记录区分增加与实际成功使用，保留来源及退款状态。支持页包含服务说明及 Apple 标准最终用户许可协议入口。
