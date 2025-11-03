import { invoiceNumberGenerator } from "@/utils/invoice-number.util";
import { Q } from "@nozbe/watermelondb";
import database from "../index";
import { DB_COLLECTION } from "../collection";
import SalesItem from "../model/sales-item.model";
import Sales from "../model/sales.model";
import { responseHandler } from "../util/response-handler";
import { normalizeToTimestamp } from "../util/normalizeToTimeStamp";
import { idxGenerator } from "@/utils/idx.utils";
import Customer from "../model/customer.model";
import { PaymentStatus } from "@/constants/payment-status";
import { activityService } from "./activity.service";

export const salesService = {
  create: async (
    salesData: Partial<Sales>,
    shopId: string,
    salesItems?: Partial<SalesItem>[],
  ) => {
    if (
      !salesData.invoiceDate ||
      !salesData.status ||
      (salesData?.status !== PaymentStatus.UNPAID && !salesData?.paymentType)
    ) {
      return responseHandler({
        message: "Invoice date, payment status and payment type are required",
        statusCode: 400,
        data: null,
        success: false,
      });
    }
    try {
      const invoiceTimestamp = normalizeToTimestamp(
        (salesData as any).invoiceDate,
      );

      //if customer attached then need works
      let customer: Customer | null = null;
      if (salesData?.customerId) {
        customer =
          ((await DB_COLLECTION.customer.find(
            salesData?.customerId,
          )) as Customer) || null;
      }
      const result = await database.write(async () => {
        const sales = await DB_COLLECTION.sales.create((s) => {
          s.invoiceNumber = salesData.invoiceNumber || invoiceNumberGenerator();
          s.shopId = shopId;
          s.invoiceDate = invoiceTimestamp as unknown as any;
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
          s.customerId = customer?.id;
          s.customerName = customer?.name;
        });

        if (Array.isArray(salesItems) && salesItems.length) {
          const salesItemCollection = DB_COLLECTION.salesItem;
          for (const it of salesItems) {
            await salesItemCollection.create((si: SalesItem) => {
              si.salesId = sales._raw.id;
              si.itemId = it.itemId;
              si.quantity = it.quantity;
              si.price = it.price || 0;
              si.discountAmount = it.discountAmount || 0;
              si.itemName = it.itemName;
              si.measurementUnit = it.measurementUnit;
              si.created_at = Date.now();
              si.updated_at = Date.now();
            });
            const item = await DB_COLLECTION.item.find(it.itemId || "");
            if (item && item?.isStockEnabled) {
              await item.update((i) => {
                i.currentStock = Number(i.currentStock) - Number(it.quantity);
                i.updatedAt = Date.now();
              });
            }
          }
        }

        if (salesData?.paymentType) {
          try {
            const paymentAccounts = await DB_COLLECTION.paymentAccount
              .query(
                Q.where("shopId", shopId),
                Q.where("name", salesData.paymentType || ""),
              )
              .fetch();

            if (paymentAccounts.length === 1) {
              await paymentAccounts[0].update((pa) => {
                pa.balance = Number(pa.balance) + Number(salesData.paidAmount);
                pa.updated_at = Date.now();
              });
            }
          } catch (error) {
            console.log("Failed to update payment account", error);
          }
        }

        if (customer && salesData.status === PaymentStatus.PARTIALLY_PAID) {
          await customer.update((c) => {
            c.outstanding =
              Number(c.outstanding) + Number(salesData.paidAmount);
            c.updated_at = Date.now();
          });
        }
        if (customer && salesData.status === PaymentStatus.UNPAID) {
          await customer.update((c) => {
            c.outstanding =
              Number(c.outstanding) + Number(salesData.grandTotalAmount);
            c.updated_at = Date.now();
          });
        }

        activityService.create({
          title: "Sales",
          description: `${salesData?.status === PaymentStatus.PAID ? `Sales made worth ${salesData.grandTotalAmount}` : `Sales Created amount ${salesData.grandTotalAmount}`}`,
          type: "Sales",
          shopId: shopId,
          platform: "Web",
        });
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
  updateSales: async (
    id: string,
    salesData: Partial<Sales>,
    newSalesItems: Partial<SalesItem>[],
  ) => {
    try {
      const result = await database.write(async () => {
        const sales = await DB_COLLECTION.sales.find(id);
        if (!sales) {
          return responseHandler({
            message: "Sales not found",
            statusCode: 404,
            data: null,
          });
        }
        await sales.update((s) => {
          s.invoiceDate = salesData.invoiceDate || 0;
          s.grandTotalAmount = salesData.grandTotalAmount || 0;
          s.subTotalAmount = salesData.subTotalAmount || 0;
          s.discountAmount = salesData.discountAmount || 0;
          s.taxAmount = salesData.taxAmount || 0;
          s.additionalAmount = salesData.additionalAmount || 0;
          s.oldDueAmount = salesData.oldDueAmount || 0;
          s.dueAmount = salesData.dueAmount || 0;
          s.paidAmount = salesData.paidAmount || 0;
          s.remarks = salesData.remarks || "";
          s.status = salesData.status || "";
          s.paymentType = salesData.paymentType || "";
        });

        const salesItems = await DB_COLLECTION.salesItem
          .query(Q.where("salesId", sales._raw.id))
          .fetch();
        for (const item of salesItems) {
          await item.destroyPermanently();
        }
        if (Array.isArray(newSalesItems) && newSalesItems.length) {
          const salesItemCollection = DB_COLLECTION.salesItem;
          for (const it of newSalesItems) {
            await salesItemCollection.create((si: SalesItem) => {
              si.salesId = sales._raw.id;
              si._raw.id = it.id || idxGenerator();
              si.itemId = it.itemId;
              si.quantity = it.quantity;
              si.price = it.price || 0;
              si.discountAmount = it.discountAmount || 0;
              si.itemName = it.itemName;
            });
          }
        }
        return responseHandler({
          message: "Sales updated successfully",
          statusCode: 200,
          data: null,
        });
      });
      return result;
    } catch (error) {
      console.log("Failed to update sales", error);
      return responseHandler({
        message: "Failed to update sales",
        statusCode: 500,
        success: false,
        data: null,
      });
    }
  },
  getSalesById: async (id: string) => {
    try {
      const result = await database.read(async () => {
        const sales = await DB_COLLECTION.sales.find(id);
        const salesItems = await DB_COLLECTION.salesItem
          .query(Q.where("salesId", id))
          .fetch();
        const shop = await DB_COLLECTION.shop.find(sales.shopId || "");
        return { sales, salesItems, shop };
      });
      console.log(result, "result");
      return responseHandler({
        data: {
          sale: result?.sales?._raw,
          salesItems: result?.salesItems?.map((item: SalesItem) => item._raw),
          shop: result?.shop?._raw,
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
  deleteSalesById: async (id: string) => {
    try {
      const result = await database.write(async () => {
        const sales = await DB_COLLECTION.sales.find(id);
        await sales.markAsDeleted();
        return responseHandler({
          message: "Sales is deleted",
          statusCode: 200,
          data: null,
        });
      });
      return result;
    } catch (error) {
      console.log("Failed to delete sales", error);
      return responseHandler({
        message: "Failed to delete sales",
        statusCode: 500,
        data: null,
      });
    }
  },
};
