import { isDate, isPlainObject, isURLSearchParams } from '../../src/helpers/util'

describe('helpers:util',() => {
  describe('isXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })
    test('should validate FormData', () => {
      expect(isURLSearchParams({})).toBeTruthy()
      expect(isURLSearchParams(new Date())).toBeFalsy()
    })
  })
})
