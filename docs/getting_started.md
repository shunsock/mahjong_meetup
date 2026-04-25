# Getting Started

## 前提条件

- [Nix](https://nixos.org/) (devShell を使用)
- Git

Nix がインストールされていれば、Node.js や pnpm は devShell から自動で提供されます。

## セットアップ

```bash
git clone git@github.com:shunsock/mahjong_meetup.git
cd mahjong_meetup
```

## 依存のインストール

```bash
nix develop -c pnpm install
```

## 開発サーバーの起動

```bash
nix develop -c pnpm dev
```

ブラウザで http://localhost:5173/mahjong_meetup/ を開くとアプリが表示されます。

## 動作確認

1. セットアップ画面でプレイヤー名を入力
2. 「対局開始」ボタンを押す
3. ダッシュボード画面で点数入力ができることを確認
