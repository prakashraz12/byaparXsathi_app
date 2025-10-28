// models/Item.ts
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import { SCHEMA_KEYS } from "../shema.keys";

export default class Item extends Model {
  static table = SCHEMA_KEYS.ITEM;

  @field("item_name") itemName?: string;
  @field("cost_price") costPrice?: number;
  @field("selling_price") sellingPrice?: number;
  @field("measurement_unit") measurementUnit?: string | null; // JSON string
  @field("opening_stock") openingStock?: number;
  @field("current_stock") currentStock?: number;
  @field("low_stock_alert") lowStockAlert?: number;
  @field("is_stock_enabled") isStockEnabled?: boolean;
  @field("is_active") isActive?: boolean;
  @field("image_url") imageUrl?: string | null;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
  @field("shopId") shopId?: string;
}
