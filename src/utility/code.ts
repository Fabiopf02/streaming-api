export function generateCode() {
  const code = Number(Math.random().toString().slice(2))
    .toString(36)
    .slice(2, 8);
  const upperCase = Math.random() > 0.5;
  if (upperCase) return code.toUpperCase();
  return code;
}
