import { Q } from "@nozbe/watermelondb";
import database from "../index";
import Shop from "../model/shop.model";
import { DB_COLLECTION } from "../collection";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import { idxGenerator } from "@/utils/idx.utils";

export const shopService = {
  createShop: (shopData: Partial<Shop>, userId: string) => {
    return database.write(async () => {
      if (!shopData?.shopName || !userId || !shopData?.shopType || !shopData?.measuringUnits) {
        Toast.error("All fields are required");
        return;
      }
  
      const idx = shopData.idx ? shopData.idx : idxGenerator();
  
      const shop = await DB_COLLECTION.shop.create((s) => {
        s.shopName = shopData.shopName!.trim();
        s.shopEmail = shopData?.shopEmail?.trim() || "";
        s.shopPhoneNumber = shopData?.shopPhoneNumber || "";
        s.address = shopData?.address?.trim() || "";
        s.panNumber = shopData?.panNumber?.trim() || "";
        s.registrationNumber = shopData?.registrationNumber?.trim() || "";
        s.created_at = Date.now();
        s.updated_at = Date.now();
        s.idx = idx;
        s.userId = userId;
        s.shopType = shopData.shopType;
        s.measuringUnits = shopData.measuringUnits;
      });
  
      return {
        message: "Shop created successfully",
        status:201,
        shop, 
      };
    });
  },
  
  getAllShops:()=>{
    return database.read(async()=>{
      const shops = await DB_COLLECTION.shop.query().fetch();
      return shops;
    })
  }
};
