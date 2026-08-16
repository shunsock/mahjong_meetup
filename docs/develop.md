# 開発ガイド

## ディレクトリ構成

```
src/
├── domain/               # ドメインロジック (純粋関数・値オブジェクト)
├── usecase/              # アプリケーションのビジネスフローと外部依存の抽象 (Port)
│   ├── game/             # 対局中の action と GameStatePort
│   ├── setup/            # セットアップ画面の action
│   └── result/           # 結果画面の action
├── adapter/
│   └── state/            # usecase の Port の実装 (React hooks 等)
├── presentation/
│   ├── screen/           # 画面のエントリーポイント (container の composition)
│   ├── container/        # 状態と effect を持ち usecase の action を起動する
│   ├── layout/           # 状態を持たない純粋な JSX 配置
│   └── component/        # 末端の UI 部品
│       ├── controls/     # 入力系コンポーネント
│       └── dialogs/      # ダイアログコンポーネント
├── main.tsx              # エントリーポイント
└── index.css             # グローバルスタイル
```

### 各レイヤーの責務

| レイヤー | 責務 | 依存先 |
|---------|------|--------|
| `domain` | 点数計算・スコアボード等のビジネスロジック。フレームワーク非依存 | なし |
| `usecase` | `domain` を使ったアプリケーションのビジネスフロー (action) と、状態操作等の外部依存を抽象化する Port | `domain` |
| `adapter` | `usecase` の Port を実装する具体的な手段 (React hooks 等) | `domain`, `usecase` |
| `presentation/screen` | 画面のエントリーポイント。`container` を composition するだけ | `container` |
| `presentation/container` | 状態と effect を持ち、`usecase` の action を起動して結果を UI へ適用する | `usecase`, `adapter`, `layout`, `domain` (型のみ) |
| `presentation/layout` | 状態を持たない純粋な JSX 配置 | `component`, `domain` (型のみ) |
| `presentation/component` | 末端の UI 部品。props のみに依存する | `domain` (型のみ) |

依存方向は次の 2 系統です。

- UI: `screen` → `container` → `layout` → `component`
- レイヤー: `container` → `usecase` → `domain` (usecase の Port を `adapter` が実装)

`component` / `layout` から `domain` への依存は import type に限ります。

画面内のイベントは次の順で流れます。

1. `component` のイベントハンドラが発火する
2. `container` の effect が受け取り、`usecase` の action を呼び出す
3. action は DI された `adapter` (Port 実装) を通じて状態を更新する
4. コールバック経由で `container` の状態が UI へ反映される

## コマンド一覧

すべてのコマンドは `nix develop -c` 経由で実行します。

```bash
# 開発サーバー
nix develop -c pnpm dev

# 型チェック
nix develop -c pnpm run typecheck

# テスト実行
nix develop -c pnpm test

# テスト (watch モード)
nix develop -c pnpm run test:watch

# プロダクションビルド
nix develop -c pnpm run build

# ビルド成果物のプレビュー
nix develop -c pnpm run preview
```

## テスト

テストは `domain` と `usecase` レイヤーに対して書かれています。`*.test.ts` ファイルが対応するモジュールと同じディレクトリに配置されています。

```bash
# 全テスト実行
nix develop -c pnpm test

# 特定ファイルのみ
nix develop -c pnpm run vitest run src/domain/scoreboard.test.ts
```

## 設計方針

- **不変データ**: ドメインオブジェクトは immutable。状態の変更は新しいオブジェクトを生成して行う
- **純粋関数**: `domain` レイヤーは副作用を持たない純粋関数で構成する
- **型安全**: `NaturalNumber` 等の値オブジェクトで不正な状態を型レベルで防止する
- **一方向依存 (UI)**: `screen` → `container` → `layout` → `component` の方向を守る
- **一方向依存 (レイヤー)**: `container` → `usecase` / `adapter` → `domain` の方向を守る

## CI

GitHub Actions で以下を自動実行しています:

- **CI** (`ci.yml`): PR と main push で typecheck / test / build を実行
- **Deploy** (`deploy.yml`): main push で GitHub Pages にデプロイ
