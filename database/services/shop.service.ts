import { Q } from "@nozbe/watermelondb";
import database from "../index";
import Shop from "../model/shop.model";
import { DB_COLLECTION } from "../collection";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import { idxGenerator } from "@/utils/idx.utils";
import PaymentAccount from "../model/payment-account.model";
import { responseHandler } from "../util/response-handler";
import { DEFAULT_PAYMENT_ACCOUNTS } from "@/constants/default-payment-account";

export const shopService = {
  createShop: (
    shopData: Partial<Shop>,
    status?: "created" | "synced"
  ) => {
    return database.write(async () => {
      if (
        !shopData?.shopName ||
        !shopData?.shopType ||
        !shopData?.measuringUnits ||
        !shopData?.userId
      ) {
        Toast.error("All fields are required");
        return;
      }

      const id = shopData?.id ? shopData.id : idxGenerator();
      const CREATED_AT = shopData?.created_at
        ? shopData.created_at
        : Date.now();
      const UPDATED_AT = shopData?.updated_at
        ? shopData?.updated_at
        : Date.now();

      const shop = await DB_COLLECTION.shop.create((s) => {
        s._raw._status = status || "created";
        s._raw.id = id;
        s.shopName = shopData.shopName!.trim();
        s.shopEmail = shopData?.shopEmail?.trim() || "";
        s.shopPhoneNumber = shopData?.shopPhoneNumber || "";
        s.address = shopData?.address?.trim() || "";
        s.panNumber = shopData?.panNumber?.trim() || "";
        s.registrationNumber = shopData?.registrationNumber?.trim() || "";
        s.created_at = CREATED_AT;
        s.updated_at = UPDATED_AT;
        s.userId = shopData?.userId;
        s.shopType = shopData.shopType;
        s.measuringUnits = shopData.measuringUnits;
      });


      DEFAULT_PAYMENT_ACCOUNTS.forEach(async (account) => {
        const id = idxGenerator();
        await DB_COLLECTION.paymentAccount.create((p) => {
          p.balance = 0;
          p.isActive = true;
          p.shopId = shop.id;
          p.name = account;
          p._raw.id = id;
        });
      });

      return {
        message: "Shop created successfully",
        status: 201,
        shop,
      };
    });
  },

  getAllShops: () => {
    return database.read(async () => {
      const shops = await DB_COLLECTION.shop.query().fetch();
      return shops;
    });
  },

  createPaymentAccount: (accountData:Partial<PaymentAccount>, shopId:string) => {
    return database.write(async () => {
      const paymentAccount = await DB_COLLECTION.paymentAccount.create((p) => {
        p.balance = 0;
        p.isActive = true;
        p.shopId = shopId;
        p.name = accountData.name || "";
      });
      return responseHandler({
        message: "Payment account created successfully",
        statusCode: 201,
        data: paymentAccount,
      });
    })
  }
};
