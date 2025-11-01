import { Q } from "@nozbe/watermelondb";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { DB_COLLECTION } from "../collection";
import {
  dateRangeProvider,
  DEFAULT_DATE_RANGE_OPTIONS_ENUMS,
} from "@/utils/date-range-provider";

export const observeDashboardAnalytics = ({
  dateRangePreset,
}: {
  dateRangePreset: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS];
}) => {
  const provider = dateRangeProvider(dateRangePreset);
  if (!provider?.startDate || !provider?.endDate) {
    throw new Error("Invalid date range");
  }

  const start = provider.startDate.getTime();
  const end = provider.endDate.getTime();

  const sales$ = DB_COLLECTION.sales
    .query(
      Q.where("invoiceDate", Q.gte(start)),
      Q.where("invoiceDate", Q.lte(end))
    )
    .observe();

  const expenses$ = DB_COLLECTION.expenses
    .query(
      Q.where("created_at", Q.gte(start)),
      Q.where("created_at", Q.lte(end))
    )
    .observe();

  const customers$ = DB_COLLECTION.customer
    .query(
      Q.where("created_at", Q.gte(start)),
      Q.where("created_at", Q.lte(end))
    )
    .observe();

  // Combine all three into one observable stream
  return combineLatest([sales$, expenses$, customers$]).pipe(
    map(([sales, expenses, customers]) => {
      const totalSales = sales.reduce(
        (sum, s) => sum + Number(s.grandTotalAmount || 0),
        0
      );
      const totalExpenses = expenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      );
      const totalCustomers = customers.length;

      return { totalSales, totalExpenses, totalCustomers };
    })
  );
};




export const observeSalesAnalytics = ({
  dateRangePreset,
}: {
  dateRangePreset: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS];
}) => {
  const provider = dateRangeProvider(dateRangePreset);
  if (!provider?.startDate || !provider?.endDate) {
    throw new Error("Invalid date range");
  }

  const start = provider.startDate.getTime();
  const end = provider.endDate.getTime();

  // Observe sales in the given date range
  const sales$ = DB_COLLECTION.sales
    .query(Q.where("invoiceDate", Q.gte(start)), Q.where("invoiceDate", Q.lte(end)))
    .observe();

  // Return reactive chart data
  return sales$.pipe(
    map((sales) => {
      // Group by day
      const grouped: Record<string, number> = {};

      sales.forEach((sale) => {
        const day = new Date(sale.invoiceDate || 0); // group key
        grouped[day.toDateString()] = (grouped[day.toDateString()] || 0) + Number(sale.grandTotalAmount || 0);
      });

      // Sort days chronologically
      const sortedDays = Object.keys(grouped)
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

      // Return chart-friendly data
      return sortedDays.map((date) => ({
        label: date.toDateString(),
        value: grouped[date.toDateString()] || 0,
      }));
    })
  );
};
