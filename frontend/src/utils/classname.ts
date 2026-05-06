export default function cn(...classnames: string[]): string {
  let str = "";
  classnames.forEach((cn) => (str += " " + cn));
  return str;
}
