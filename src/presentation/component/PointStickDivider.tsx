/**
 * 点棒をモチーフにした装飾的な区切り線。
 * 中央に赤い丸（万点棒の意匠）を持つ白い棒を水平に配置する。
 */
export const PointStickDivider = () => (
  <div role="separator" className="flex items-center justify-center gap-3 py-2">
    <span className="h-px flex-1 bg-neutral-700" />
    <svg
      width="120"
      height="16"
      viewBox="0 0 120 16"
      fill="none"
      aria-hidden="true"
    >
      {/* 棒の本体 */}
      <rect x="0" y="5" width="120" height="6" rx="3" fill="#d4d4d4" />
      {/* 中央の赤丸 */}
      <circle cx="60" cy="8" r="2.5" fill="#ef4444" />
    </svg>
    <span className="h-px flex-1 bg-neutral-700" />
  </div>
);
