import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema/schema'
import migrations from './migrations'
import Customer from './model/customer.model'
import Shop from './model/shop.model'
import Item from './model/item.model'
import SalesItem from './model/sales-item.model'
import Sales from './model/sales.model'
import PaymentAccount from './model/payment-account.model'
import Expenses from './model/expenses.model'
import Income from './model/income.model'
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: Platform.OS === 'ios', /* Platform.OS === 'ios' */
  onSetUpError: error => {
    console.error("Database setup error:", error);
   
  }
})

// Then, make a Watermelon database from it!c
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
    Income
  ],
})
export default database;
// export const resetDataBase = database.write(async () => {
//     await database.unsafeResetDatabase()
// })