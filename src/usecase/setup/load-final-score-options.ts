/**
 * セットアップ画面が最終得点設定の選択肢を取得するための入口。
 *
 * presentation 層が domain を直接 import せずに済むよう、
 * domain/final-score の公開シンボルをここで re-export する。
 */
export { UMA_PRESETS, DEFAULT_CONFIG } from '../../domain/final-score';
