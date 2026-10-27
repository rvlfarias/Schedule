export function getMonthDays(month: string): string[] {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return [];
  }

  const [year, monthNumber] = month.split("-").map(Number);

  if (monthNumber < 1 || monthNumber > 12) {
    return [];
  }

  const totalDays = new Date(year, monthNumber, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");

    return `${month}-${day}`;
  });
}

export function formatDate(date: string): string {
  const [, month, day] = date.split("-");

  return `${day}/${month}`;
}

export function getCurrentMonth(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}