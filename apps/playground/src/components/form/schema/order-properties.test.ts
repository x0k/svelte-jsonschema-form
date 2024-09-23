import { describe, expect, it } from 'vitest';
import { orderProperties } from './order-properties';

function fix(keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, {}]));
}

describe.only('orderProperties()', () => {
  it('returns properties when order array is not specified', () => {
    const keys = ['foo', 'baz']
    const properties = fix(keys);
    expect(orderProperties(properties, undefined)).toEqual(keys);
  });

  it('should remove from order elements that are not in properties', () => {
    const properties = fix(['foo', 'baz']);
    const order = ['foo', 'bar', 'baz', 'qux'];
    expect(orderProperties(properties, order)).toEqual(['foo', 'baz']);
  });

  it('should order properties according to the order', () => {
    const properties = fix(['bar', 'foo']);
    const order = ['foo', 'bar'];
    expect(orderProperties(properties, order)).toEqual(['foo', 'bar']);
  });

  it('should replace * with properties that are absent in order', () => {
    const properties = fix(['foo', 'bar', 'baz']);
    const order = ['*', 'foo'];
    expect(orderProperties(properties, order)).toEqual(['bar', 'baz', 'foo']);
  });

  it('should handle more complex ordering case correctly', () => {
    const properties = fix(['foo', 'baz', 'qux', 'bar']);
    const order = ['quux', 'foo', '*', 'corge', 'baz'];
    expect(orderProperties(properties, order)).toEqual(['foo', 'qux', 'bar', 'baz']);
  });
  it('throws error when * is missing and there is one more prop than ordered', () => {
    const properties = fix(['foo', 'bar', 'baz']);
    const order = ['foo', 'baz'];
    expect(() => orderProperties(properties, order)).toThrowError(
      "uiSchema order list does not contain property 'bar'"
    );
  });
  it('throws error when * is missing and there are a few more props than ordered', () => {
    const properties = fix(['foo', 'bar', 'baz']);
    const order = ['foo'];
    expect(() => orderProperties(properties, order)).toThrowError(
      "uiSchema order list does not contain properties 'bar', 'baz'"
    );
  });
  it('throws error when there are multiple *s in order', () => {
    const properties = fix(['foo', 'bar', 'baz']);
    const order = ['*', 'foo', '*'];
    expect(() => orderProperties(properties, order)).toThrowError(
      'uiSchema order list contains more than one wildcard item'
    );
  });
});
