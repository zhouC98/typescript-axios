import { buildURL } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL',() => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(
        buildURL('/foo', {
          foo: 'bar',
        })
      ).toBe('/foo?foo=bar')
    })
  })
})
