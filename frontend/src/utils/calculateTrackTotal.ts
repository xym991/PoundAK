import {
  addPercentages,
  performanceTrackItem,
} from "@/repositories/track.repository";

export default function calculateTotal(
  data: any,
  byQuantity: boolean = false,
  name?: string
): any {
  if (!data) return "0";

  if (name === "game") {
    const metricAverages = Object.keys(data)?.map((metricKey) => {
      let values = data[metricKey];
      if (metricKey === "date") values = [];

      if (!values.length || typeof values !== "object") values = [];

      const sum = values?.reduce(
        (acc: number, val: any) => acc + parseInt(val || 0),
        0
      );
      return sum / (values.length || 1);
    });

    const totalAverage = metricAverages.reduce((acc, val) => acc + val, 0) / 3;

    return Math.min(Math.round(totalAverage || 0), 100);
  }

  let values: string[] = ["0%"];
  data?.tasks?.forEach((t: any) => {
    t.options.forEach((o: any) => {
      if (o.selected) {
        values.push(addPercentages(t.value, o.value));
      }
    });
  });

  if (byQuantity) {
    let rendered = data.tasks?.filter((t: any) => t.rendered);
    let total = 0;
    data?.tasks?.forEach((t: any) => {
      t.options.forEach((o: any) => {
        if (o.selected) {
          total += t.xp;
        }
      });
    });
    if (name == "fitness") {
      if (
        data.tasks?.[0]?.options?.filter(
          (o: any) => o.label.toLowerCase() == "rest day"
        )[0]?.selected == true
      ) {
        return 500;
      }
    }
    return name == "fitness"
      ? Math.floor((total * 3) / (rendered?.length || 1))
      : total;
  }
  const max = data?.tasks?.reduce((acc: any, t: any) => {
    return acc + (t.rendered ? parseInt(t.value) : 0);
  }, 0);

  const result = values
    ?.map((v) => Number(v?.replace("%", "")))
    .reduce((acc, i) => acc + i, 0);
  const divisor: any = Math.ceil(max / 100) || 1;

  return (result / divisor).toFixed(0);
}
