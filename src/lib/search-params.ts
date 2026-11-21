export function oneOf<T extends string>(
  value: string | undefined,
  options: readonly T[],
  fallback: T,
): T {
  return value !== undefined && (options as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

export function positiveInt(value: string | undefined, fallback = 1): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
