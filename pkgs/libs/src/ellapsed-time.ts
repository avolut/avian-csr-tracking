export const ellapsedTime = (fromMs: number) => {
  const t1 = Math.round(new Date().getTime() - fromMs) / 1000
  return Math.round(t1 * 10) / 10
}
