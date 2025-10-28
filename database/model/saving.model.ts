import { Model } from "@nozbe/watermelondb";
import { SCHEMA_KEYS } from "../shema.keys";
import { children, field } from "@nozbe/watermelondb/decorators";

export default class Saving extends Model {
    static table = SCHEMA_KEYS.SAVING;
   
    @field("amount") amount?: number;
    @field("title") title?: string;
    @field("remarks") remarks?: string;
    @field("shopId") shopId?: string;
    @field("created_at") created_at?: number;
    @field("updated_at") updated_at?: number;
  }
  