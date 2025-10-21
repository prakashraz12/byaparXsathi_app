import database from ".";
import Customer from "./model/customer.model";
import { SCHEMA_KEYS } from "./shema.keys";
import Shop from "./model/shop.model";
import Item from "./model/item.model";
import Sales from "./model/sales.model";
import SalesItem from "./model/sales-item.model";
import PaymentAccount from "./model/payment-account.model";

export const DB_COLLECTION = {
  customer: database.collections.get<Customer>(SCHEMA_KEYS.CUSTOMER),
  shop: database.collections.get<Shop>(SCHEMA_KEYS.SHOP),
  item:database.collections.get<Item>(SCHEMA_KEYS.ITEM),
  sales:database.collections.get<Sales>(SCHEMA_KEYS.SALES),
  salesItem:database.collections.get<SalesItem>(SCHEMA_KEYS.SALES_ITEM),
  paymentAccount:database.collections.get<PaymentAccount>(SCHEMA_KEYS.PAYMENT_ACCOUNT),
};
