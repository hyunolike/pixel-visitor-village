# Pixel Visitor Village

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | **简体中文**

[![Tistory 标志与像素角色的项目介绍插图](docs/assets/readme-tistory-village.png)](https://pixel-visitor-village.pages.dev/)

在Tistory博客中，将今天的访客数变成同等数量像素角色的小村庄。

<a href="https://pixel-visitor-village.pages.dev/#demo"><img src="docs/assets/entry/visit-village-zh-CN.svg" alt="逛逛小村庄 — 体验最新的像素村庄。" width="640"></a>

[安装到Tistory](https://pixel-visitor-village.pages.dev/install?lang=zh-CN) · [使用文档（韩语）](https://pixel-visitor-village.pages.dev/docs/)

## 20秒介绍视频

[![像素访客村庄介绍视频](docs/assets/intro-preview.gif)](public/media/intro.mp4)

[观看视频](https://pixel-visitor-village.pages.dev/#intro-film) · [MP4](public/media/intro.mp4)

视频和演示中的访客数均为演示输入。

## 主要功能

- 将今天的累计访客数显示为0至5,000个像素角色。
- 可选择圣诞节、春、夏、秋、冬五种景色。
- 角色会散步和打招呼，支持暂停和减少动态效果。

## 安装

1. 在[安装页面](https://pixel-visitor-village.pages.dev/install?lang=zh-CN)输入博客地址，选择季节并复制代码。
2. 备份当前皮肤，在Tistory管理中打开 **꾸미기 → 스킨 편집 → HTML 편집** 并粘贴代码。
3. 在实际博客中检查访客数和手机布局。

博客所有者需要亲自将代码粘贴到皮肤。组件使用今天的累计数，不代表同时在线人数或个人身份。尚未完成实际Tistory账号的皮肤安装验证。

## 开发

使用Node.js 22.12以上版本和pnpm 10。浏览器测试需要Google Chrome。

```bash
pnpm install
pnpm dev
```

[配置与API](docs/reference/widget.zh-CN.md) · [开发、测试与部署](docs/reference/widget.zh-CN.md#本地开发) · [制作信息与音乐来源](docs/features/visitor-village/intro-media.md)
