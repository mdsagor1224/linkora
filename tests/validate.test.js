import { describe, it, expect } from 'vitest'
import { validateUrl, validateAlias } from '../src/lib/validate.js'
import { generateCode } from '../api/create-link.js'
describe('validateUrl', () => {
  it('accepts http/https', () => { expect(validateUrl('https://a.com/x')).toBeTruthy(); expect(validateUrl('http://a.com')).toBeTruthy() })
  it('rejects unsafe schemes', () => { for (const u of ['javascript:alert(1)', 'data:text/html,hi', 'file:///etc/passwd', 'ftp://a.com', 'nope']) expect(validateUrl(u)).toBeNull() })
  it('rejects credentials and overlong input', () => { expect(validateUrl('https://u:p@a.com')).toBeNull(); expect(validateUrl('https://a.com/' + 'x'.repeat(2100))).toBeNull() })
})
describe('validateAlias', () => {
  it('allows empty and valid', () => { expect(validateAlias('')).toBe(true); expect(validateAlias('my-link_1')).toBe(true) })
  it('rejects short, bad chars, reserved', () => { expect(validateAlias('ab')).toBe(false); expect(validateAlias('a b c d')).toBe(false); expect(validateAlias('login')).toBe(false) })
})
describe('generateCode', () => {
  it('is 7 safe chars and varies', () => { const a = generateCode(), b = generateCode(); expect(a).toMatch(/^[A-Za-z0-9]{7}$/); expect(a).not.toBe(b) })
})
