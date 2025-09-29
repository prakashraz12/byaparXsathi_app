import { useEffect, useState } from "react";
import { DB_COLLECTION } from "../collection";
import { useUserStore } from "@/store/useUserStore";
import Shop from "../model/shop.model";

const useShops = () => {
  const [shops, setShops] = useState([]);
  const {activeShopId} = useUserStore()
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadShops = async () => {
    setIsLoading(true);
    try {
      const query = DB_COLLECTION.shop.query();
      const records = await query.fetch();
      const shops = records.map((shop) => shop._raw);
      setShops(shops as any);
    } catch (error) {
      console.error("Error loading shops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);
const activeShop = shops.find((s:Shop)=> s.idx === activeShopId) as Shop | undefined
  return { shops, isLoading, activeShop };
};
export default useShops;
