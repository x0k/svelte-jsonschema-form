export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
export const lcm = (a: number, b: number): number =>
  Math.abs(a * b) / gcd(a, b);
