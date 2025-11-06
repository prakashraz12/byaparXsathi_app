import { useEffect, useState } from 'react';

import { useUserStore } from '@/store/useUserStore';

import { DB_COLLECTION } from '../collection';
import PaymentAccount from '../model/payment-account.model';
import Shop from '../model/shop.model';

const useShops = () => {
  const [shops, setShops] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);

  const { activeShopId } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadShops = async () => {
    setIsLoading(true);
    try {
      const query = DB_COLLECTION.shop.query();
      const records = await query.fetch();
      const shops = records.map((shop) => shop._raw);
      setShops(shops as any);
      const paymentAccountQuery = DB_COLLECTION.paymentAccount.query();
      const paymentAccountRecords = await paymentAccountQuery.fetch();
      const paymentAccounts = paymentAccountRecords.map((paymentAccount) => paymentAccount._raw);
      setPaymentAccounts(paymentAccounts as any);
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);
  const activeShop = shops.find((s: Shop) => s.id === activeShopId) as Shop | undefined;
  const currentPaymentAccount = paymentAccounts.filter(
    (p: PaymentAccount) => p.shopId === activeShopId,
  ) as PaymentAccount[] | undefined;
  return { shops, isLoading, activeShop, currentPaymentAccount };
};
export default useShops;
