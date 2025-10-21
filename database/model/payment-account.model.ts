import { Model } from "@nozbe/watermelondb";
import { field, writer } from "@nozbe/watermelondb/decorators";
import { SCHEMA_KEYS } from "../shema.keys";

export default class PaymentAccount extends Model {
  static table = SCHEMA_KEYS.PAYMENT_ACCOUNT;

  @field("balance") balance?: number;
  @field("isActive") isActive?: boolean;
  @field("shopId") shopId?: string;
  @field("name") name?: string;
  @field("createdAt") createdAt?: Date;
  @field("updatedAt") updatedAt?: Date;

  @writer async addAmount(amount: number) {
    await this.update(account =>{
      console.log("account", account, amount)
      account.balance = (account.balance || 0)  + amount;
    })
  }
}
