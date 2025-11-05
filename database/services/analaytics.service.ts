import { Q } from "@nozbe/watermelondb";
import { combineLatest, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { DB_COLLECTION } from "../collection";
import {
  dateRangeProvider,
  DEFAULT_DATE_RANGE_OPTIONS_ENUMS,
} from "@/utils/date-range-provider";
import { PaymentStatus } from "@/constants/payment-status";

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
      Q.where("invoiceDate", Q.lte(end)),
    )
    .observe();

  const expenses$ = DB_COLLECTION.expenses
    .query(
      Q.where("created_at", Q.gte(start)),
      Q.where("created_at", Q.lte(end)),
    )
    .observe();

  const customers$ = DB_COLLECTION.customer
    .query(
      Q.where("created_at", Q.gte(start)),
      Q.where("created_at", Q.lte(end)),
    )
    .observe();

  // Combine all three into one observable stream
  return combineLatest([sales$, expenses$, customers$]).pipe(
    map(([sales, expenses, customers]) => {
      const totalSales = sales.reduce(
        (sum, s) => sum + Number(s.grandTotalAmount || 0),
        0,
      );
      const totalExpenses = expenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0,
      );
      const totalCustomers = customers.length;

      return { totalSales, totalExpenses, totalCustomers };
    }),
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
    .query(
      Q.where("invoiceDate", Q.gte(start)),
      Q.where("invoiceDate", Q.lte(end)),
    )
    .observe();

  // Return reactive chart data
  return sales$.pipe(
    map((sales) => {
      // Group by day
      const grouped: Record<string, number> = {};

      sales.forEach((sale) => {
        const day = new Date(sale.invoiceDate || 0); // group key
        grouped[day.toDateString()] =
          (grouped[day.toDateString()] || 0) +
          Number(sale.grandTotalAmount || 0);
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
    }),
  );
};

export const observeSalesSummary = ({
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
    .query(
      Q.where("invoiceDate", Q.gte(start)),
      Q.where("invoiceDate", Q.lte(end)),
    )
    .observe();

  // Return reactive chart data
  return sales$.pipe(
    map((sales) => {
      // Group by status
      let paid = 0;
      let unpaid = 0;
      let partialPaid = 0;

      sales.forEach((sale) => {
        const day = new Date(sale.invoiceDate || 0); // group key
        if (sale.status === PaymentStatus.PAID) {
          paid += Number(sale.grandTotalAmount || 0);
        } else if (sale.status === PaymentStatus.UNPAID) {
          unpaid += Number(sale.grandTotalAmount || 0);
        } else {
          partialPaid += Number(sale.grandTotalAmount || 0);
        }
      });

      // Return chart-friendly data
      return {
        paid,
        unpaid,
        partialPaid,
      };
    }),
  );
};

export const observeSalesByPayments = ({
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
      Q.where("invoiceDate", Q.lte(end)),
    )
    .observe();

  return sales$.pipe(
    map((sales) => {
      // Group by paymentType
      const grouped: Record<string, number> = {};

      sales.forEach((sale) => {
        if (!sale?.paymentType) return;
        const paymentType = sale?.paymentType || "Unknown";
        const total = Number(sale?.grandTotalAmount || 0);
        grouped[paymentType] = (grouped[paymentType] || 0) + total;
      });

      // Convert grouped data into sorted array of objects
      const result = Object.entries(grouped)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value) // sort descending by value
        .slice(0, 5); // optional: limit to top 5

      return result;
    }),
  );
};

export const observeTopSaleItems = ({
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
      Q.where("invoiceDate", Q.lte(end)),
    )
    .observe();

  return sales$.pipe(
    switchMap((sales) => {
      const salesIds = sales.map((s) => s.id);
      if (salesIds.length === 0) return from([[]]);

      // fetch all sales items for these sales
      return from(
        DB_COLLECTION.salesItem
          .query(Q.where("salesId", Q.oneOf(salesIds)))
          .fetch(),
      );
    }),
    switchMap(async (salesItems) => {
      if (!salesItems.length) return [];

      // fetch all items data (for cost/selling price)
      const itemIds = salesItems
        .map((si) => si.itemId)
        .filter((id) => typeof id === "string");

      const items = await DB_COLLECTION.item
        .query(Q.where("id", Q.oneOf(itemIds)))
        .fetch();

      const itemPriceMap: Record<
        string,
        { sellingPrice: number; costPrice: number }
      > = {};
      items.forEach((it) => {
        itemPriceMap[it.id] = {
          sellingPrice: Number(it.sellingPrice || 0),
          costPrice: Number(it.costPrice || 0),
        };
      });

      // group by item name and aggregate totals
      const grouped: Record<
        string,
        { totalAmount: number; timesSold: number; profitOrLoss: number }
      > = {};

      salesItems.forEach((item) => {
        const name = item?.itemName || "Unknown";
        const total = Number(item?.price || 0) * Number(item?.quantity || 0);
        const quantity = Number(item?.quantity || 1);

        const itemInfo = itemPriceMap[item.itemId || 0];
        const sellingPrice = itemInfo?.sellingPrice ?? 0;
        const costPrice = itemInfo?.costPrice ?? 0;
        const profit = (sellingPrice - costPrice) * quantity;

        if (!grouped[name]) {
          grouped[name] = {
            totalAmount: 0,
            timesSold: 0,
            profitOrLoss: 0,
          };
        }

        grouped[name].totalAmount += total;
        grouped[name].timesSold += quantity;
        grouped[name].profitOrLoss += profit;
      });

      // Convert grouped to array
      const result = Object.entries(grouped)
        .map(([label, data]) => ({
          label,
          totalAmount: data.totalAmount,
          timesSold: data.timesSold,
          profitOrLoss: data.profitOrLoss,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 5);

      return result;
    }),
  );
};
