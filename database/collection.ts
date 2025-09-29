import database from ".";
import Customer from "./model/customer.model";
import { SCHEMA_KEYS } from "./shema.keys";
import Shop from "./model/shop.model";

export const DB_COLLECTION = {
  customer: database.get<Customer>(SCHEMA_KEYS.CUSTOMER),
  shop: database.get<Shop>(SCHEMA_KEYS.SHOP),
};
