import { Formatter } from '../src/formatter'

describe('Formatter', () => {
  it('should correctly format a path', () => {
    {
      const ORIGINAL = '/A/pAt-H_/To'
      expect(Formatter.format(ORIGINAL, 'camel')).toBe('/a/pAtH/to')
      expect(Formatter.format(ORIGINAL, 'pascal')).toBe('/A/PAtH/To')
      expect(Formatter.format(ORIGINAL, 'kebab')).toBe('/a/p-at-h/to')
      expect(Formatter.format(ORIGINAL, 'snake')).toBe('/a/p_at_h/to')
    }

    {
      const ORIGINAL = '/src/index'
      expect(Formatter.format(ORIGINAL, 'camel')).toBe(ORIGINAL)
      expect(Formatter.format(ORIGINAL, 'pascal')).toBe('/Src/Index')
      expect(Formatter.format(ORIGINAL, 'kebab')).toBe(ORIGINAL)
      expect(Formatter.format(ORIGINAL, 'snake')).toBe(ORIGINAL)
    }
  })
})
