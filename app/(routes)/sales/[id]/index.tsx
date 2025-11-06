import { useLocalSearchParams } from 'expo-router';

import SingleSalesScreen from '@/screen/sales/single-sales.screen';

const SingleSales = () => {
  const { id } = useLocalSearchParams();
  return <SingleSalesScreen id={id as string} />;
};
export default SingleSales;
