import { Q } from '@nozbe/watermelondb';

import database from '..';
import { DB_COLLECTION } from '../collection';

export const paymentAccountService = {
  addAmount: async (amount: number, shopId: string, name: string) => {
    try {
      const result = await database.write(async () => {
        const paymentAccounts = await DB_COLLECTION.paymentAccount
          .query(Q.where('shopId', shopId), Q.where('name', name))
          .fetch();

        if (paymentAccounts.length > 0) {
          const paymentAccount = paymentAccounts[0];

          await paymentAccount.update((p) => {
            const currentBalance = (p.balance as number) || 0;
            p.balance = currentBalance + amount;
          });


          return {
            success: true,
            message: 'Payment account balance updated',
          };
        } else {
          console.warn('⚠️ No payment account found for this payment type');
          return {
            success: false,
            message: 'No payment account found',
          };
        }
      });

      return result;
    } catch (error) {
      console.error('❌ Failed to update payment account:', error);
      return {
        success: false,
        message: 'Error updating payment account',
      };
    }
  },
};
