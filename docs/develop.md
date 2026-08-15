# 開発ガイド

## ディレクトリ構成

```
src/
├── domain/          # ドメインロジック (純粋関数・値オブジェクト)
├── usecase/         # アプリケーションのビジネスフローと外部依存の抽象 (Port)
├── adapter/         # usecase の Port の実装 (React hooks 等)
├── presentation/    # UI コンポーネント
│   ├── controls/    # 入力系コンポーネント
│   └── dialogs/     # ダイアログコンポーネント
├── main.tsx         # エントリーポイント
└── index.css        # グローバルスタイル
```

### 各レイヤーの責務

| レイヤー | 責務 | 依存先 |
|---------|------|--------|
| `domain` | 点数計算・スコアボード等のビジネスロジック。フレームワーク非依存 | なし |
| `usecase` | `domain` を使ったアプリケーションのビジネスフロー (action) と、状態操作等の外部依存を抽象化する Port | `domain` |
| `adapter` | `usecase` の Port を実装する具体的な手段 (React hooks 等) | `domain`, `usecase` |
| `presentation` | 画面表示とユーザー操作のハンドリング | `domain`, `usecase`, `adapter` |

依存方向は `presentation` → `usecase` / `adapter` → `domain` の一方向です。`domain` は他のレイヤーに依存しません。`adapter` は `usecase` が定義する Port を実装する形で依存します。

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

テストは `domain` レイヤーに対して書かれています。`*.test.ts` ファイルが対応するモジュールと同じディレクトリに配置されています。

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
- **一方向依存**: `presentation` → `usecase` / `adapter` → `domain` の依存方向を守る

## CI

GitHub Actions で以下を自動実行しています:

- **CI** (`ci.yml`): PR と main push で typecheck / test / build を実行
- **Deploy** (`deploy.yml`): main push で GitHub Pages にデプロイ
