import { describe, expect, it } from 'vitest';
import { normalizeLocale, resolveLocale, saveLocale } from './install-i18n';

describe('installation language selection', () => {
  it.each([
    ['ko-KR', 'ko'], ['en-GB', 'en'], ['ja-JP', 'ja'], ['zh-TW', 'zh-CN'],
    ['ZH-cn', 'zh-CN'], ['zh_Hans', 'zh-CN'], ['fr', undefined], ['', undefined], [null, undefined],
    ['en--GB', undefined], ['ja-!', undefined],
  ])('normalizes %s to a supported language', (input, expected) => {
    expect(normalizeLocale(input)).toBe(expected);
  });

  it('prioritizes a shared URL over a saved preference and browser language', () => {
    expect(resolveLocale('?ref=blog&lang=ja-JP', () => 'en', ['ko-KR'])).toBe('ja');
  });

  it('falls through unsupported values to the first supported browser language', () => {
    expect(resolveLocale('?lang=fr', () => 'de', ['fr-FR', 'zh-TW', 'en-US'])).toBe('zh-CN');
    expect(resolveLocale('', () => 'ja', ['en-US'])).toBe('ja');
  });

  it('ignores malformed URL and saved language tags', () => {
    expect(resolveLocale('?lang=en--GB', () => 'ko', ['en-US'])).toBe('ko');
    expect(resolveLocale('', () => 'ja-!', ['zh-TW'])).toBe('zh-CN');
  });

  it('works when browser storage is blocked and falls back to Korean', () => {
    const blocked = () => { throw new Error('Storage blocked'); };
    expect(resolveLocale('', blocked, ['en-AU'])).toBe('en');
    expect(resolveLocale('', blocked, ['fr'])).toBe('ko');
    expect(() => saveLocale('ja', blocked)).not.toThrow();
    let saved = '';
    saveLocale('zh-CN', value => { saved = value; });
    expect(saved).toBe('zh-CN');
  });
});
