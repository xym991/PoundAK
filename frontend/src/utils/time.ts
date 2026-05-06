export function parseTime(timeStr: string) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (modifier === "AM" && hours === 12) hours = 0; // Midnight case
  if (modifier === "PM" && hours !== 12) hours += 12; // PM conversion

  return new Date().setHours(hours, minutes, seconds, 0); // Convert to timestamp
}

export function isTimePassed(storedTime: string) {
  const storedTimestamp = parseTime(storedTime);
  const currentTimestamp = new Date().getTime(); // Current time in milliseconds

  return currentTimestamp >= storedTimestamp;
}
