export function FormatePhone(value: string) {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);

  if (match) {
    if (match[2].length === 5) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    } else {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }

  return value;
}
