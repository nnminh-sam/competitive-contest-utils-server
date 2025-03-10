export function camelCaseToNormal(s: string) {
  return s
    .split(/(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
}
