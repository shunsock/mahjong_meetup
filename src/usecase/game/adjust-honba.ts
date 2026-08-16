import { NaturalNumber } from '../../domain/natural-number';

/**
 * 本場カウンタを 1 増やす。
 *
 * @param current 現在の本場数。
 */
export const incrementHonba = (current: NaturalNumber): NaturalNumber =>
  NaturalNumber.of(current + 1);

/**
 * 本場カウンタを 1 減らす。0 を下回らない。
 *
 * @param current 現在の本場数。
 */
export const decrementHonba = (current: NaturalNumber): NaturalNumber =>
  NaturalNumber.of(Math.max(0, current - 1));

/**
 * 本場カウンタを 0 にリセットする。
 */
export const resetHonba = (): NaturalNumber => NaturalNumber.of(0);
