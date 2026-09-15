import { Transform } from 'class-transformer';

export function TransformToArray() {
  return Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return Array.isArray(value) ? value : [value];
  });
}
