import useShops from "@/database/hooks/useShops";
import { MeasuringUnitType } from "@/types/measuring-unit";
import { useEffect, useMemo, useState } from "react";

interface UseGetMeasuringUnitsProps {
  renderActiveOnly?: boolean;
}

/**
 * Custom hook to fetch and filter measuring units from the active shop
 * @param renderActiveOnly - If true, only returns active measuring units (default: true)
 * @returns Object containing filtered measuring units and search functionality
 */
const useGetMeasuringUnits = ({
  renderActiveOnly = true,
}: UseGetMeasuringUnitsProps = {}) => {
  const [searchParams, setSearchParams] = useState<string>("");
  const { activeShop } = useShops();

  // Parse measuring units from active shop
  const allMeasuringUnits = useMemo<MeasuringUnitType[]>(() => {
    if (!activeShop?.measuringUnits) return [];
    
    try {
      const parsed = JSON.parse(activeShop.measuringUnits);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing measuring units:", error);
      return [];
    }
  }, [activeShop?.measuringUnits]);

  // Filter by active status
  const activeMeasuringUnits = useMemo(() => {
    if (!renderActiveOnly) return allMeasuringUnits;
    return allMeasuringUnits.filter((unit) => unit.active === true);
  }, [allMeasuringUnits, renderActiveOnly]);

  // Filter by search params
  const measuringUnits = useMemo(() => {
    if (!searchParams.trim()) return activeMeasuringUnits;
    
    const searchLower = searchParams.toLowerCase().trim();
    return activeMeasuringUnits.filter((unit) =>
      unit.label?.toLowerCase().includes(searchLower)
    );
  }, [activeMeasuringUnits, searchParams]);

  return {
    measuringUnits,
    searchParams,
    setSearchParams,
    totalCount: allMeasuringUnits.length,
    activeCount: activeMeasuringUnits.length,
    filteredCount: measuringUnits.length,
  };
};

export default useGetMeasuringUnits;