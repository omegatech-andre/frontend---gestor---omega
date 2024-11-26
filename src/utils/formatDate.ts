export default function FormatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR');
}
