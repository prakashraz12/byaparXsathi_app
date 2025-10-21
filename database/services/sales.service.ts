import { invoiceNumberGenerator } from "@/utils/invoice-number.util";
import { Q } from "@nozbe/watermelondb";
import database from "..";
import { DB_COLLECTION } from "../collection";
import SalesItem from "../model/sales-item.model";
import Sales from "../model/sales.model";
import { responseHandler } from "../util/response-handler";

export const salesService = {
  create: async (salesData: Partial<Sales>, shopId: string) => {
    if (!salesData.invoiceDate || !salesData.status) {
      return responseHandler({
        message: "Invoice date is required",
        statusCode: 400,
        data: null,
      });
    }
    try {
      const normalizeToTimestamp = (value: any): number => {
        if (value instanceof Date) return value.getTime();
        if (typeof value === "string") return new Date(value).getTime();
        if (typeof value === "number") {
          return value < 1e12 ? value * 1000 : value;
        }
        return Date.now();
      };
      const invoiceTimestamp = normalizeToTimestamp(
        (salesData as any).invoiceDate
      );
      const result = await database.write(async () => {
        const sales = await DB_COLLECTION.sales.create((s) => {
          s.invoiceNumber = salesData.invoiceNumber || invoiceNumberGenerator();
          s.shopId = shopId;
          s.invoiceDate = invoiceTimestamp as unknown as any;
          s.createdAt = (salesData.createdAt
            ? new Date(salesData.createdAt)
            : Date.now()) as unknown as any;
          s.grandTotalAmount = salesData.grandTotalAmount || 0;
          s.subTotalAmount = salesData.subTotalAmount || 0;
          s.discountAmount = salesData.discountAmount || 0;
          s.taxAmount = salesData.taxAmount || 0;
          s.additionalAmount = salesData.additionalAmount || 0;
          s.oldDueAmount = salesData.oldDueAmount || 0;
          s.dueAmount = salesData.dueAmount || 0;
          s.paidAmount = salesData.paidAmount;
          s.remarks = salesData.remarks || "";
          s.status = salesData.status || "";
          s.paymentType = salesData.paymentType || "";

          s.updatedAt = (salesData.updatedAt
            ? new Date(salesData.updatedAt).getTime()
            : Date.now()) as unknown as any;
        });

        if (
          Array.isArray(salesData.salesItems) &&
          salesData.salesItems.length
        ) {
          const salesItemCollection = DB_COLLECTION.salesItem;
          for (const it of salesData.salesItems) {
            await salesItemCollection.create((si: any) => {
              si.salesId = sales._raw.id;
              si.itemId = it.itemId;
              si.quantity = it.quantity;
              si.price = it.price || 0;
              si.discountAmount = it.discountAmount || 0;
              si.itemName = it.itemName;
              si.createdAt = Date.now();
              si.updatedAt = Date.now();
            });
          }
        }

        if (salesData?.paymentType) {
          try {
            const paymentAccounts = await DB_COLLECTION.paymentAccount
              .query(
                Q.where("shopId", shopId),
                Q.where("name", salesData.paymentType || "")
              )
              .fetch();

            if (paymentAccounts.length === 1) {
              console.log("paymentAccounts", paymentAccounts);
               paymentAccounts[0].addAmount(salesData.paidAmount || 0);
            }
          } catch (error) {
            console.log("Failed to update payment account", error);
          }
        }

        return responseHandler({
          message: "Sales is created",
          statusCode: 201,
          data: null,
        });
      });
      return result;
    } catch (error) {
      console.log("Failed to create sales", error);
      return responseHandler({
        message: "Failed to create sales",
        statusCode: 500,
        data: null,
      });
    }
  },
  getSalesById: async (id: string) => {
    try {
      const result = await database.read(async () => {
        const sales = await DB_COLLECTION.sales.find(id);
        const salesItems = await sales.salesItems.fetch();
        const shop = await DB_COLLECTION.shop.find(sales.shopId || "");
        return responseHandler({
          message: "Sales is fetched",
          statusCode: 200,
          data: { sales, salesItems, shop },
        });
      });
      return responseHandler({
        data: {
          sale: result.data?.sales?._raw,
          salesItems: result.data?.salesItems?.map(
            (item: SalesItem) => item._raw
          ),
          shop: result.data?.shop?._raw,
        },
      });
    } catch (error) {
      console.log("Failed to fetch sales", error);
      return responseHandler({
        message: "Failed to fetch sales",
        statusCode: 500,
        data: null,
      });
    }
  },
};
