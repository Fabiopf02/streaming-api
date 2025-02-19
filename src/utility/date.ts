export function minutesToMillis(minutes: number) {
  return minutes * 60 * 1000;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutesToMillis(minutes));
}

export function InternalDate(date: Date) {
  return {
    addMinutes: (minutes: number) => addMinutes(date, minutes),
    isAfter: (date2: Date) => isAfter(date, date2),
  };
}

export function isAfter(date1: Date, date2: Date) {
  return new Date(date1).getTime() > new Date(date2).getTime();
}
