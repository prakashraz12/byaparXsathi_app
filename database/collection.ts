import database from '.';
import { Activity } from './model/activity.model';
import Customer from './model/customer.model';
import Expenses from './model/expenses.model';
import Income from './model/income.model';
import Item from './model/item.model';
import PaymentAccount from './model/payment-account.model';
import PaymentIn from './model/paymentIn.model';
import Sales from './model/sales.model';
import SalesItem from './model/sales-item.model';
import Shop from './model/shop.model';
import { SCHEMA_KEYS } from './shema.keys';

export const DB_COLLECTION = {
  customer: database.collections.get<Customer>(SCHEMA_KEYS.CUSTOMER),
  shop: database.collections.get<Shop>(SCHEMA_KEYS.SHOP),
  item: database.collections.get<Item>(SCHEMA_KEYS.ITEM),
  sales: database.collections.get<Sales>(SCHEMA_KEYS.SALES),
  salesItem: database.collections.get<SalesItem>(SCHEMA_KEYS.SALES_ITEM),
  paymentAccount: database.collections.get<PaymentAccount>(SCHEMA_KEYS.PAYMENT_ACCOUNT),
  expenses: database.collections.get<Expenses>(SCHEMA_KEYS.EXPENSES),
  income: database.collections.get<Income>(SCHEMA_KEYS.INCOME),
  activity: database.collections.get<Activity>(SCHEMA_KEYS.ACTIVITY),
  paymentIn: database.collections.get<PaymentIn>(SCHEMA_KEYS.PAYMENT_IN),
};
