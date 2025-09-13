import database from ".";
import Customer from "./model/customer.model";
import { SCHEMA_KEYS } from "./shema.keys";

export const DB_COLLECTION = {
  customer: database.get<Customer>(SCHEMA_KEYS.CUSTOMER),
};
