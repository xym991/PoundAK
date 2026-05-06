export default function getWeeklyData(obj: Record<string, any> | null = null): {
  curr: string[];
  prev: string[];
} {
  const date = new Date();
  const format = (d: Date) => d.toLocaleDateString("en-US");

  const curr: string[] = [];
  const prev: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() - i);
    curr.push(format(d));
  }

  for (let i = 7; i < 14; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() - i);
    prev.push(format(d));
  }

  if (obj) {
    return {
      curr: curr.map((d) => obj[d]).filter((i) => typeof i === "object"),
      prev: prev.map((d) => obj[d]).filter((i) => typeof i === "object"),
    };
  }

  return { curr, prev };
}
