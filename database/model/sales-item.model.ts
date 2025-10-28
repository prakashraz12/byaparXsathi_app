import { Model } from "@nozbe/watermelondb";
import { SCHEMA_KEYS } from "../shema.keys";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class SalesItem extends Model {
  static table = SCHEMA_KEYS.SALES_ITEM;
 

  @field("itemId") itemId?: string;
  @field("quantity") quantity?: number;
  @field("price") price?: number;
  @field("discountAmount") discountAmount?: number;
  @field("createdAt") createdAt?: Date;
  @field("updatedAt") updatedAt?: Date;
  @field("itemName") itemName?: string;
  @field("salesId") salesId?: string;
  @field("created_at") created_at?: Date;
  @field("updated_at") updated_at?: Date;

}
