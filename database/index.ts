import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Platform } from 'react-native';

import migrations from './migrations';
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
import schema from './schema/schema';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === 'ios',
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [
    Customer,
    Shop,
    Item,
    Sales,
    SalesItem,
    PaymentAccount,
    Expenses,
    Income,
    Activity,
    PaymentIn,
  ],
});
export default database;
// export const resetDataBase = database.write(async () => {
//     await database.unsafeResetDatabase()
// })
