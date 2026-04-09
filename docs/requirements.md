# 麻雀ダッシュボード 要件定義

## 1. 概要

### 1.1 目的
麻雀(日本リーチ麻雀、4人打ち)の自動卓の隣に置く**補助ツール**。大画面スクリーンに4人分の持ち点・順位・点差を表示し、対局中の点数移動をボタン操作で完結させる。

### 1.2 スコープ外 (やらないこと)
対局ロジックは自動卓に任せ、本アプリでは一切扱わない。

- 局の進行管理 (東一局 → 東二局 ...)
- 親/子の状態管理 (誰が親かの追跡)
- リーチ棒・供託の管理
- 本場の管理
- 役・翻・符の計算
- ウマ・オカ・順位点の計算
- トビによる対局終了判定

### 1.3 責務 (やること)
- 4人分の持ち点の保持と表示
- 点数移動の操作UI (ロン / ツモ / 流局)
- 順位と点差の可視化
- 直前操作の取り消し (Undo)
- 対局のリセット

## 2. 利用環境

| 項目 | 内容 |
|---|---|
| 動作環境 | 大画面スクリーン (テレビ・大型モニタ想定) |
| 入力デバイス | マウス/キーボード直接接続 |
| プラットフォーム | Web ブラウザ (フルスクリーン表示) |
| 利用者 | 対局中のプレイヤーの1人 (記録係) |
| ネットワーク | 不要 (オフライン動作) |

## 3. 機能要件

### 3.1 起動フロー
1. プレイヤー名入力画面を表示
2. 4人分の名前を入力 (P1〜P4)
3. 持ち点を 25000 × 4 で初期化
4. メインダッシュボードへ遷移

### 3.2 メインダッシュボード

#### レイアウト
**横一列**に4枚のプレイヤーカードを**順位順**に並べる。

```
┌──────────────────────────────────────────────────┐
│                                                  │
│ [1位]     [2位]     [3位]     [4位]              │
│  P2        P1        P3        P4                │
│ 26,500    25,000    24,500    24,000             │
│ +1,500     ±0        -500     -1,000             │
│                                                  │
│   [ ロン ]  [ ツモ ]  [ 流局 ]  [ Undo ] [リセット]  │
└──────────────────────────────────────────────────┘
```

#### カードの表示内容
- 順位 (1位 / 2位 / 3位 / 4位)
- プレイヤー名
- 持ち点 (カンマ区切り)
- トップとの点差 (プラス記号付き、トップは `±0`)

#### 順位判定
- 持ち点が多い順
- 同点の場合は表示順を崩さない (安定ソート)

### 3.3 操作フロー

#### ロン
1. `[ロン]` ボタン押下 → ロンダイアログ表示
2. **和了者**を4人から選択
3. **放銃者**を残り3人から選択
4. 点数を指定:
   - 子の点数プリセット: `1000` `1300` `1600` `2000` `2600` `3200` `3900` `5200` `7700`
   - 満貫以上プリセット: `8000` `12000` `16000` `24000` `32000`
   - 親の場合用プリセット: 上記の 1.5 倍の値 (切り上げ100点単位)
   - または自由入力
5. `確定` で点数移動を適用
6. `キャンセル` でダイアログを閉じる

#### ツモ
1. `[ツモ]` ボタン押下 → ツモダイアログ表示
2. **和了者**を選択
3. `子ツモ` / `親ツモ` を選択
4. **合計点**を指定 (プリセット or 自由入力)
5. `確定` → 分配を自動計算して適用

##### 分配ロジック
```
子ツモ (合計 total 点):
  - 親からの支払い = ceil(total / 4 / 100) × 100 × 2
  - 子からの支払い = ceil(total / 4 / 100) × 100 (子2人それぞれ)
  例: 合計 8000 → 親 4000 / 子 2000 × 2

親ツモ (合計 total 点):
  - 子からの支払い = ceil(total / 3 / 100) × 100 (子3人それぞれ)
  例: 合計 12000 → 子 4000 × 3
```

> **注**: 100点単位の切り上げのため、「合計8000」と指定しても厳密には 4000+2000+2000=8000 のようにピッタリにならないケースがある。これは麻雀の慣例通りの挙動なので仕様通り。

#### 流局
1. `[流局]` ボタン押下 → 流局ダイアログ表示
2. 各プレイヤーのチェックボックスで**テンパイ/不テンパイ**を指定
3. `確定` → テンパイ料 (3000点) を自動分配

##### 分配ロジック
```
テンパイ人数が 0 または 4 の場合: 点数移動なし
テンパイ人数が 1 の場合: 不テンパイ3人がそれぞれ 1000 払う → テンパイ1人が 3000 受け取る
テンパイ人数が 2 の場合: 不テンパイ2人がそれぞれ 1500 払う → テンパイ2人がそれぞれ 1500 受け取る
テンパイ人数が 3 の場合: 不テンパイ1人が 3000 払う → テンパイ3人がそれぞれ 1000 受け取る
```

#### Undo
- 直前の `ScoreMovement` を取り消す
- 実装: イベント配列 `history[]` の末尾を `pop` して、初期状態から `reduce` で再計算
- Undo 履歴は対局中のみ保持 (リセットで消える)
- 実行可能な操作がない場合はボタンを無効化

#### リセット
1. `[リセット]` ボタン押下 → 確認ダイアログ表示
2. `OK` で起動時のプレイヤー名入力画面に戻る
3. `キャンセル` で現在の状態を維持

### 3.4 点数プリセット一覧

#### 子 (非親) の点数
| 種別 | ロン点 |
|---|---:|
| 1翻30符 | 1000 |
| 1翻40符 | 1300 |
| 1翻50符 / 2翻25符 | 1600 |
| 2翻30符 | 2000 |
| 2翻40符 | 2600 |
| 2翻50符 / 3翻25符 | 3200 |
| 3翻30符 | 3900 |
| 3翻40符 / 4翻20符 | 5200 |
| 4翻30符 | 7700 |
| 満貫 | 8000 |
| 跳満 | 12000 |
| 倍満 | 16000 |
| 三倍満 | 24000 |
| 役満 | 32000 |

#### 親 の点数
子の点数の 1.5 倍 (100点単位切り上げ)。例: 満貫 12000、跳満 18000、倍満 24000、三倍満 36000、役満 48000。

### 3.5 トビ処理
特別な処理はしない。持ち点がマイナスになった場合も通常通り表示する (マイナス符号付き)。

## 4. 非機能要件

### 4.1 ユーザビリティ
- 大画面想定のため**巨大フォント**を使用 (持ち点は画面の1/10以上の高さ)
- クリック可能領域は十分広く (最小 60×60 px)
- 操作の取り消しが容易 (Undo の誤押防止は不要、ただしリセットは確認ダイアログ必須)

### 4.2 可搬性
- ブラウザさえあれば動く静的サイトとしてビルド可能
- ローカルファイルからの直接実行もサポート (file:// でも動く)

### 4.3 永続化
- なし。ブラウザを閉じると状態は消える
- リロードでも状態は消える (意図的)

## 5. 技術スタック

| 項目 | 選定 |
|---|---|
| 言語 | TypeScript |
| フレームワーク | React |
| ビルドツール | Vite |
| 状態管理 | `useReducer` (必要になったら Zustand) |
| スタイリング | Tailwind CSS |
| パッケージ実行 | `nix develop` または `nix run nixpkgs#nodejs` |
| テスト | Vitest (domain 層の単体テスト中心) |

## 6. アーキテクチャ

### 6.1 ディレクトリ構成
```
src/
├── domain/             # 純粋関数・型定義 (React 非依存)
│   ├── player.ts       # PlayerId, Player
│   ├── scoreboard.ts   # Scoreboard, apply, replay
│   ├── movement.ts     # ScoreMovement (Sum type)
│   └── distribution.ts # ツモ分配、流局分配
├── state/              # React state glue
│   └── useGameState.ts
├── ui/
│   ├── App.tsx
│   ├── SetupScreen.tsx  # プレイヤー名入力画面
│   ├── Dashboard.tsx    # メインダッシュボード
│   ├── PlayerCard.tsx
│   ├── dialogs/
│   │   ├── RonDialog.tsx
│   │   ├── TsumoDialog.tsx
│   │   ├── RyukyokuDialog.tsx
│   │   └── ResetDialog.tsx
│   └── controls/
│       └── ScorePresetButtons.tsx
└── main.tsx
```

### 6.2 依存方向
```
ui → state → domain
```
一方向。循環依存禁止。domain は React/DOM に一切依存しない。

### 6.3 主要な型定義 (ドラフト)
```typescript
// domain/player.ts
export type PlayerId = 'p1' | 'p2' | 'p3' | 'p4';
export type Player = Readonly<{ id: PlayerId; name: string }>;

// domain/scoreboard.ts
export type Points = number;
export type Scoreboard = Readonly<{
  players: ReadonlyArray<Player>;
  scores: Readonly<Record<PlayerId, Points>>;
}>;

// domain/movement.ts
export type ScoreMovement =
  | Readonly<{ kind: 'ron';        winner: PlayerId; loser: PlayerId;  amount: Points }>
  | Readonly<{ kind: 'tsumo-ko';   winner: PlayerId; dealer: PlayerId; total:  Points }>
  | Readonly<{ kind: 'tsumo-oya';  winner: PlayerId;                   total:  Points }>
  | Readonly<{ kind: 'ryukyoku';   tenpai: ReadonlyArray<PlayerId> }>;

// domain/scoreboard.ts
export const apply: (board: Scoreboard, movement: ScoreMovement) => Scoreboard;
export const replay: (initial: Scoreboard, history: ReadonlyArray<ScoreMovement>) => Scoreboard;
```

### 6.4 状態管理
```typescript
// state/useGameState.ts
type GameState = Readonly<{
  initial: Scoreboard;              // リセット時の初期状態
  history: ReadonlyArray<ScoreMovement>;
}>;

type GameAction =
  | { type: 'dispatch'; movement: ScoreMovement }
  | { type: 'undo' }
  | { type: 'reset'; players: ReadonlyArray<Player> };

// 現在の状態は derived
const currentBoard = useMemo(() => replay(state.initial, state.history), [state]);
```

### 6.5 設計原則
- **不変性**: すべてのドメインオブジェクトは immutable
- **純粋関数**: 状態遷移は副作用なしの関数として表現
- **宣言的**: UI は「何を表示するか」を記述し、手続きを書かない
- **疎結合**: domain 層は React に依存しない → プラットフォーム変更時に流用可能
- **型安全**: `ScoreMovement` を sum type にして、不正な状態を型レベルで排除

## 7. テスト方針

### 7.1 必須テスト (domain 層)
- `distribution.ts`:
  - 子ツモの分配 (100点切り上げ含む全パターン)
  - 親ツモの分配
  - 流局の全テンパイパターン (0〜4人)
- `scoreboard.ts`:
  - `apply` が各 `ScoreMovement` に対して正しい点数を返すこと
  - `replay` が空配列・単一・複数イベントで正しく動くこと
  - Undo 相当の挙動 (`history.slice(0, -1)` → `replay`)

### 7.2 オプション (UI 層)
- ダイアログの開閉
- ボタン選択で正しい `ScoreMovement` が dispatch されること

## 8. 今後の拡張余地 (スコープ外)
- 履歴の永続化 (IndexedDB / localStorage)
- 複数半荘の累計表示
- リモート同期 (各プレイヤーのスマホから閲覧)
- 音声入力 ("三九ロン" のような発声で入力)

これらはすべて v2 以降の検討事項。v1 では意図的に取り込まない。
