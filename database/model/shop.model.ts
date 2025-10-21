import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";
import { SCHEMA_KEYS } from "../shema.keys";

export default class Shop extends Model {
    static table = SCHEMA_KEYS.SHOP
    @text("shopName") shopName?: string;
    @text("shopEmail") shopEmail?: string;
    @text("shopPhoneNumber") shopPhoneNumber?: string;
    @text("address") address?: string;
    @text("panNumber") panNumber?: string;
    @text("registrationNumber") registrationNumber?: string;
    @text("measuringUnits") measuringUnits?: string;
    @text("userId") userId?: string;
    @text("shopType") shopType?: string;
    @text("shopPanNumber") shopPanNumber?: string;
    @text("created_at") created_at?: number;
    @text("updated_at") updated_at?: number;
}
