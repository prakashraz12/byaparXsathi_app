import CustomInput from "@/components/re-usables/input";
import AddItemsSlideup from "@/components/sales/add-items-slideup";
import { COLORS } from "@/constants/Colors";
import { useItems } from "@/database/hooks/useItem";
import Item from "@/database/model/item.model";
import PXWrapper from "@/layouts/px-wrapper";
import ItemCard from "@/screen/items/item-card";
import { router } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const SalesItem = () => {
  const [openSelectItemConfig, setOpenSelectItemConfig] = useState(false);
  const [searchParams, setSearchParams] = useState<string>("");
  const [item, setItem] = useState<Item | null>(null);

  const { items } = useItems({
    search: searchParams,
    sortBy: "desc",
  });

  return (
    <>
      <PXWrapper
        data={items}
        renderItem={({ item }: { item: Item }) => (
          <TouchableOpacity
            onPress={() => {
              setItem(item);
              setOpenSelectItemConfig(true);
            }}
          >
            <ItemCard
              itemName={item.itemName || ""}
              sellingPrice={item.sellingPrice || 0}
              costPrice={item.costPrice || 0}
              currentLevel={item.currentStock || 0}
              openingLevel={item.openingStock || 0}
              isActive={item.isActive || false}
              isStockEnable={item.isStockEnabled || false}
            />
          </TouchableOpacity>
        )}
        header={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <CustomInput
                value={searchParams}
                onChangeText={setSearchParams}
                placeholder="Search Items"
                leftIcon={<Search />}
              />
            </View>
          </View>
        }
      ></PXWrapper>
      <AddItemsSlideup
        visible={openSelectItemConfig}
        onClose={() => setOpenSelectItemConfig(false)}
        item={item}
        onSave={() => router.back()}
      />
    </>
  );
};
export default SalesItem;
