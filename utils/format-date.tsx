import { nepaliCalendar } from "../components/re-usables/date-picker/calender-config";

export function getDateFormat(
  dateObj: number,
  mode: "AD",
  withTime: false,
  ampmFormat?: boolean
): Date;
export function getDateFormat(
  dateObj: number,
  mode: "AD",
  withTime: true,
  ampmFormat?: boolean
): string;
export function getDateFormat(
  dateObj: number,
  mode: "BS",
  withTime?: boolean,
  ampmFormat?: boolean
): string;
export function getDateFormat(
  dateObj: number,
  mode: "BS" | "AD" = "BS",
  withTime?: boolean,
  ampmFormat?: boolean // if true, show AM/PM, else 24-hour
): string | Date {
  const localTime = new Date(dateObj);

  // Convert AD → BS
  const bsDateObj = nepaliCalendar.getBsDateByAdDate(
    localTime.getFullYear(),
    localTime.getMonth() + 1,
    localTime.getDate()
  );
  const formattedBsDate = nepaliCalendar.formatBsDateEN(bsDateObj, "YYYY-MM-DD");

  if (mode === "AD") {
    if (!withTime) return localTime;
    const hours = localTime.getHours();
    const minutes = String(localTime.getMinutes()).padStart(2, "0");

    if (ampmFormat) {
      const ampm = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      return `${hour12}:${minutes} ${ampm}`;
    } else {
      return `${hours}:${minutes}`;
    }
  } else {
    if (!withTime) return formattedBsDate;
    const hours = localTime.getHours();
    const minutes = String(localTime.getMinutes()).padStart(2, "0");

    if (ampmFormat) {
      const ampm = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedBsDate} . ${hour12}:${minutes} ${ampm}`;
    } else {
      return `${formattedBsDate} . ${hours}:${minutes}`;
    }
  }
}

