/** Normalizza un nome per il confronto: minuscole, senza diacritici, solo lettere/spazi/punti. */
export function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .replace(/ø/g, 'o')
    .replace(/đ/g, 'd')
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z. ]/g, '')
    .trim();
}

export function surnameOf(normalized: string): string {
  const parts = normalized.split(' ').filter(Boolean);
  return parts[parts.length - 1] ?? normalized;
}
