import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { salesService } from '@/database/services/sales.service';
import EditSalesScreen from '@/screen/sales/edit-sales.screen';
import { useSalesItemStore } from '@/store/useSalesItem';

const EditSales = () => {
  const { id } = useLocalSearchParams();
  const [salesData, setSalesData] = useState(null);

  const fetchSales = useCallback(async () => {
    if (!id) return;
    const { data } = await salesService.getSalesById(id as string);
    if (data) {
      setSalesData(data.sale);
      useSalesItemStore.setState({ salesItems: data?.salesItems });
    }
  }, [id]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return <>{salesData && <EditSalesScreen id={id as string} salesData={salesData} />}</>;
};

export default EditSales;
