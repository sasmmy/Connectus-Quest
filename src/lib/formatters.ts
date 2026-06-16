export function formatXp(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function clampPercent(value: number) {
  return Math.min(Math.max(value, 0), 100);
}
