export function easeInOutQuad(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue;
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue;
}
