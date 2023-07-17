export function generateExpirationDate(mount: number, year: number): Date {
  return new Date(year, mount - 1);
}
