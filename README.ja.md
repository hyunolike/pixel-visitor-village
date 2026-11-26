# Pixel Visitor Village

[한국어](README.md) | [English](README.en.md) | **日本語** | [简体中文](README.zh-CN.md)

[![Tistoryロゴとピクセルキャラクターの紹介イラスト](docs/assets/readme-tistory-village.png)](https://pixel-visitor-village.pages.dev/)

Tistoryブログの今日の訪問者数と同じ数のキャラクターが集まる、小さなピクセルの村です。

<a href="https://pixel-visitor-village.pages.dev/#demo"><img src="docs/assets/entry/visit-village-ja.svg" alt="村を見に行く — 最新の村を体験しましょう。" width="640"></a>

[Tistoryに設置する](https://pixel-visitor-village.pages.dev/install?lang=ja) · [使い方（韓国語）](https://pixel-visitor-village.pages.dev/docs/)

## 20秒の紹介動画

[![小さな訪問者の村の紹介動画](docs/assets/intro-preview.gif)](public/media/intro.mp4)

[動画を見る](https://pixel-visitor-village.pages.dev/#intro-film) · [MP4](public/media/intro.mp4)

動画とデモの訪問者数はデモ用です。

## 主な機能

- 今日の累計訪問者数を0〜5,000体のキャラクターで表示します。
- クリスマスと春・夏・秋・冬の5つの風景を選べます。
- キャラクターが歩いてあいさつします。一時停止とモーション軽減に対応します。

## 設置

1. [設置画面](https://pixel-visitor-village.pages.dev/install?lang=ja)で季節を選び、コードをコピーします。ブログアドレスは管理画面へのリンクが必要な場合だけ入力します。
2. スキンをバックアップし、Tistory管理の **꾸미기 → 스킨 편집 → HTML 편집** に貼り付けます。
3. 実際のブログで訪問者数とモバイル表示を確認します。

所有者がスキンにコードを貼り付ける必要があります。今日の累計値を使い、同時接続者や個人の身元は表しません。実際のTistoryアカウントでの設置検証は未完了です。

## 開発

Node.js 22.12以上とpnpm 10を使用します。ブラウザテストにはGoogle Chromeが必要です。

```bash
pnpm install
pnpm dev
```

[設定とAPI](docs/reference/widget.ja.md) · [開発・テスト・デプロイ](docs/reference/widget.ja.md#ローカル開発) · [制作情報と音楽の出典](docs/features/visitor-village/intro-media.md)
